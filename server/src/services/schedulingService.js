import { APPOINTMENT_STATUS } from "../../../shared/constants/appointmentStatus.js";
import {
	createAppointment,
	findAppointmentById,
	findAppointmentsByPractitioner,
	findAppointmentsByPatient,
	findDistinctPatientsForPractitioner,
	findOverlappingAppointments,
	findUpcomingAppointments,
	findUpcomingAppointmentsForPatient,
	findRecentAppointmentsForPatient,
	countUpcomingAppointments,
	countUpcomingAppointmentsForPatient,
	countAppointmentsForPatient,
} from "../repositories/appointmentRepository.js";
import { listActiveResources, findResourceById } from "../repositories/resourceRepository.js";
import TREATMENT_OFFERS, { getTreatmentById } from "../../../shared/constants/treatments.js";
import {
	findUserById,
	listPatientsForPractitioner,
	listPractitioners,
	assignPractitionerToPatient,
} from "../repositories/userRepository.js";
import { AuthorizationError, ValidationError } from "../utils/errorTypes.js";

const normalizeId = (value) => {
	if (!value) {
		return undefined;
	}
	if (typeof value === "string") {
		return value;
	}
	if (typeof value === "object" && typeof value.toString === "function") {
		return value.toString();
	}
	return String(value);
};

const idsEqual = (left, right) => {
	const a = normalizeId(left);
	const b = normalizeId(right);
	return Boolean(a && b && a === b);
};

const ensureDate = (value, field) => {
	if (value instanceof Date) {
		if (Number.isNaN(value.getTime())) {
			throw new ValidationError(`${field} must be a valid date`);
		}
		return value;
	}
	if (typeof value === "string" || typeof value === "number") {
		const parsed = new Date(value);
		if (Number.isNaN(parsed.getTime())) {
			throw new ValidationError(`${field} must be a valid date`);
		}
		return parsed;
	}
	throw new ValidationError(`${field} must be a valid date`);
};

const ensureChronologicalWindow = (startValue, endValue) => {
	const start = ensureDate(startValue, "startTime");
	const end = ensureDate(endValue, "endTime");

	if (end <= start) {
		throw new ValidationError("endTime must be after startTime");
	}

	return { start, end };
};

const serializeUser = (user) => {
	if (!user) {
		return null;
	}
	if (typeof user.toSafeObject === "function") {
		return user.toSafeObject();
	}
	if (typeof user.toObject === "function") {
		const { password: _password, __v: _version, ...rest } = user.toObject({ virtuals: true });
		return rest;
	}
	return user;
};

const resolvePractitionerId = (currentUser, explicitId) => {
	if (!currentUser) {
		throw new AuthorizationError();
	}

	if (currentUser.role === "practitioner") {
		if (explicitId && !idsEqual(explicitId, currentUser.id)) {
			throw new AuthorizationError("You are not allowed to act on behalf of another practitioner.");
		}
		return currentUser.id;
	}

	if (currentUser.role === "admin") {
		if (!explicitId) {
			throw new ValidationError("practitionerId is required");
		}
		return explicitId;
	}

	throw new AuthorizationError();
};

const ensurePractitioner = async (practitionerId) => {
	const practitioner = await findUserById(practitionerId);
	if (!practitioner || practitioner.role !== "practitioner") {
		throw new ValidationError("Practitioner not found");
	}
	return practitioner;
};

const ensurePatient = async (patientId) => {
	const patient = await findUserById(patientId);
	if (!patient || patient.role !== "patient") {
		throw new ValidationError("Patient not found");
	}
	return patient;
};

const resolveTreatmentDefinition = (treatmentId) => {
	if (!treatmentId) {
		return null;
	}

	const treatment = getTreatmentById(treatmentId);
	if (!treatment) {
		throw new ValidationError("Treatment not found");
	}

	return treatment;
};

const ensureResourceExists = async (resourceId) => {
	if (!resourceId) {
		return null;
	}

	const resource = await findResourceById(resourceId);
	if (!resource) {
		throw new ValidationError("Resource not found");
	}
	return resource;
};

const assertPatientAccess = (currentUser, patient) => {
	if (!currentUser) {
		throw new AuthorizationError();
	}

	if (currentUser.role === "patient") {
		if (!idsEqual(patient.id, currentUser.id)) {
			throw new AuthorizationError();
		}
		return;
	}

	if (currentUser.role === "practitioner") {
		if (!patient.practitionerId || !idsEqual(patient.practitionerId, currentUser.id)) {
			throw new AuthorizationError("You cannot access this patient");
		}
		return;
	}

	if (currentUser.role === "admin") {
		return;
	}

	throw new AuthorizationError();
};

const resolvePractitionerForPatient = async (patient, requestedPractitionerId) => {
	const assignedId = normalizeId(patient.practitionerId);
	const requestedId = normalizeId(requestedPractitionerId);

	if (requestedId && assignedId && requestedId !== assignedId) {
		throw new ValidationError("Please request time with your assigned practitioner.");
	}

	if (assignedId) {
		const practitioner = await ensurePractitioner(assignedId);
		return { practitioner, shouldAssign: false };
	}

	if (!requestedId) {
		throw new ValidationError("Select a practitioner to request a session.");
	}

	const practitioner = await ensurePractitioner(requestedId);
	return { practitioner, shouldAssign: true };
};

const assertNoConflicts = async ({ practitionerId, resourceId, start, end }) => {
	const conflicts = await findOverlappingAppointments({
		practitionerId,
		resourceId,
		start,
		end,
	});

	if (conflicts.length > 0) {
		throw new ValidationError("The selected time overlaps with an existing appointment");
	}
};

const buildQueryWindow = ({ start, end, limit } = {}, { startLabel = "start", endLabel = "end" } = {}) => {
	const options = {};

	if (start) {
		options.start = ensureDate(start, startLabel);
	}

	if (end) {
		options.end = ensureDate(end, endLabel);
	}

	if (options.start && options.end && options.end <= options.start) {
		throw new ValidationError(`${endLabel} must be after ${startLabel}`);
	}

	if (limit) {
		options.limit = limit;
	}

	return options;
};

export const getPractitionerDashboard = async (currentUser, practitionerId) => {
	const targetPractitionerId = resolvePractitionerId(currentUser, practitionerId);
	const practitioner = await ensurePractitioner(targetPractitionerId);
	const now = new Date();

	const [
		upcomingAppointments,
		upcomingCount,
		patientList,
		distinctPatientIds,
		resources,
	] = await Promise.all([
		findUpcomingAppointments(practitioner.id, { from: now, limit: 10 }),
		countUpcomingAppointments(practitioner.id, { from: now }),
		listPatientsForPractitioner(practitioner.id),
		findDistinctPatientsForPractitioner(practitioner.id),
		listActiveResources(),
	]);

		const treatments = TREATMENT_OFFERS;

		return {
			practitioner: serializeUser(practitioner),
			stats: {
				upcomingCount,
				patientCount: patientList.length || distinctPatientIds.length,
				treatmentCount: treatments.length,
				resourceCount: resources.length,
			},
			upcomingAppointments,
			patients: patientList,
			treatments,
			resources,
		};
};

export const listPractitionerAppointments = async (currentUser, query = {}) => {
	const targetPractitionerId = resolvePractitionerId(currentUser, query.practitionerId);
	const practitioner = await ensurePractitioner(targetPractitionerId);
	const window = buildQueryWindow(query, {
		startLabel: "start",
		endLabel: "end",
	});

	return findAppointmentsByPractitioner(practitioner.id, window);
};

export const createPractitionerAppointment = async (currentUser, payload) => {
	const practitionerId = resolvePractitionerId(currentUser, payload.practitionerId);
	const practitioner = await ensurePractitioner(practitionerId);
	const patient = await ensurePatient(payload.patientId);

	if (
		currentUser.role === "practitioner" &&
		patient.practitionerId &&
		!idsEqual(patient.practitionerId, practitioner.id)
	) {
		throw new AuthorizationError("You cannot schedule for a patient assigned to another practitioner");
	}

	const { start, end } = ensureChronologicalWindow(payload.startTime, payload.endTime);
	const treatmentId = payload.treatmentId;
	const treatment = resolveTreatmentDefinition(treatmentId);
	await ensureResourceExists(payload.resourceId);

	await assertNoConflicts({
		practitionerId: practitioner.id,
		resourceId: payload.resourceId,
		start,
		end,
	});

	const appointment = await createAppointment({
		practitioner: practitioner.id,
		patient: patient.id,
		resource: payload.resourceId || undefined,
		startTime: start,
		endTime: end,
		title: payload.title || treatment?.name || "Therapy session",
		description: payload.description ?? treatment?.description ?? undefined,
		status: payload.status || APPOINTMENT_STATUS.SCHEDULED,
		notes: payload.notes,
		createdBy: currentUser.id,
		treatmentId: treatment?.id,
	});

	return findAppointmentById(appointment.id);
};

export const getPatientDashboard = async (currentUser, patientId) => {
	if (!currentUser) {
		throw new AuthorizationError();
	}

	const effectivePatientId = patientId || (currentUser.role === "patient" ? currentUser.id : undefined);

	if (!effectivePatientId) {
		throw new ValidationError("patientId is required");
	}

	const patient = await ensurePatient(effectivePatientId);
	assertPatientAccess(currentUser, patient);

	const practitioner = patient.practitionerId
		? await ensurePractitioner(patient.practitionerId)
		: null;

	const now = new Date();

	const [
		upcomingAppointments,
		recentAppointments,
		totalAppointments,
		upcomingCount,
		resources,
		practitionerList,
	] = await Promise.all([
		findUpcomingAppointmentsForPatient(patient.id, { from: now, limit: 10 }),
		findRecentAppointmentsForPatient(patient.id, { before: now, limit: 10 }),
		countAppointmentsForPatient(patient.id),
		countUpcomingAppointmentsForPatient(patient.id, { from: now }),
		listActiveResources(),
		listPractitioners(),
	]);

		const treatments = TREATMENT_OFFERS;

		return {
			patient: serializeUser(patient),
			practitioner: serializeUser(practitioner),
			stats: {
				totalAppointments,
				upcomingCount,
			},
			upcomingAppointments,
			recentAppointments,
			treatments,
			resources,
			practitioners: practitionerList.map(serializeUser),
		};
};

export const listPatientAppointments = async (currentUser, filters = {}) => {
	if (!currentUser) {
		throw new AuthorizationError();
	}

	const effectivePatientId = filters.patientId || (currentUser.role === "patient" ? currentUser.id : undefined);

	if (!effectivePatientId) {
		throw new ValidationError("patientId is required");
	}

	const patient = await ensurePatient(effectivePatientId);
	assertPatientAccess(currentUser, patient);

	const window = buildQueryWindow(filters, {
		startLabel: "start",
		endLabel: "end",
	});

	return findAppointmentsByPatient(patient.id, window);
};

export const createPatientAppointmentRequest = async (currentUser, payload) => {
	if (!currentUser || !["patient", "admin"].includes(currentUser.role)) {
		throw new AuthorizationError();
	}

	if (currentUser.role === "admin") {
		throw new ValidationError("Admins must specify a patient context to create appointments");
	}

	let patient = await ensurePatient(currentUser.id);
	const { practitioner, shouldAssign } = await resolvePractitionerForPatient(patient, payload.practitionerId);

	if (shouldAssign) {
		const updatedPatient = await assignPractitionerToPatient(patient.id, practitioner.id);
		patient = updatedPatient || (await ensurePatient(currentUser.id));
	}
	const { start, end } = ensureChronologicalWindow(payload.startTime, payload.endTime);
	const treatmentId = payload.treatmentId;
	const treatment = resolveTreatmentDefinition(treatmentId);
	await ensureResourceExists(payload.resourceId);

	await assertNoConflicts({
		practitionerId: practitioner.id,
		resourceId: payload.resourceId,
		start,
		end,
	});

	const appointment = await createAppointment({
		practitioner: practitioner.id,
		patient: patient.id,
		resource: payload.resourceId || undefined,
		startTime: start,
		endTime: end,
		title: payload.title || treatment?.name || "Therapy session",
		description: payload.description ?? treatment?.description ?? undefined,
		status: APPOINTMENT_STATUS.SCHEDULED,
		notes: payload.notes,
		createdBy: patient.id,
		treatmentId: treatment?.id,
	});

	return findAppointmentById(appointment.id);
};

