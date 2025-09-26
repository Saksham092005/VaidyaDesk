import { ValidationError } from "../utils/errorTypes.js";

const asTrimmedString = (value, field) => {
	if (value === undefined || value === null) {
		return undefined;
	}

	if (typeof value !== "string") {
		throw new ValidationError(`${field} must be a string`);
	}

	const trimmed = value.trim();
	return trimmed.length > 0 ? trimmed : undefined;
};

const ensureProvided = (value, field) => {
	if (value === undefined || value === null || value === "") {
		throw new ValidationError(`${field} is required`);
	}
	return value;
};

const coerceLimit = (value) => {
	if (value === undefined || value === null || value === "") {
		return undefined;
	}

	const numeric = Number(value);

	if (!Number.isFinite(numeric) || numeric <= 0) {
		throw new ValidationError("limit must be a positive number");
	}

	return Math.min(Math.floor(numeric), 200);
};

export const validateCreateAppointmentPayload = (body = {}) => {
	const result = {};

	if (body.practitionerId) {
		result.practitionerId = asTrimmedString(body.practitionerId, "practitionerId");
	}

	result.patientId = asTrimmedString(ensureProvided(body.patientId, "patientId"), "patientId");
	result.startTime = ensureProvided(body.startTime, "startTime");
	result.endTime = ensureProvided(body.endTime, "endTime");

	if (body.treatmentId) {
		result.treatmentId = asTrimmedString(body.treatmentId, "treatmentId");
	}

	if (body.resourceId) {
		result.resourceId = asTrimmedString(body.resourceId, "resourceId");
	}

	if (body.status) {
		result.status = asTrimmedString(body.status, "status");
	}

	if (body.title !== undefined) {
		const title = asTrimmedString(body.title, "title");
		if (title) {
			result.title = title;
		}
	}

	if (body.description !== undefined) {
		if (typeof body.description !== "string") {
			throw new ValidationError("description must be a string");
		}
		result.description = body.description.trim();
	}

	if (body.notes !== undefined) {
		if (typeof body.notes !== "string") {
			throw new ValidationError("notes must be a string");
		}
		result.notes = body.notes.trim();
	}

	return result;
};

export const validatePatientCreateAppointmentPayload = (body = {}) => {
	const result = {};

	result.startTime = ensureProvided(body.startTime, "startTime");
	result.endTime = ensureProvided(body.endTime, "endTime");

	if (body.treatmentId) {
		result.treatmentId = asTrimmedString(body.treatmentId, "treatmentId");
	}

	if (body.resourceId) {
		result.resourceId = asTrimmedString(body.resourceId, "resourceId");
	}

	if (body.practitionerId) {
		result.practitionerId = asTrimmedString(body.practitionerId, "practitionerId");
	}

	if (body.title !== undefined) {
		const title = asTrimmedString(body.title, "title");
		if (title) {
			result.title = title;
		}
	}

	if (body.description !== undefined) {
		if (typeof body.description !== "string") {
			throw new ValidationError("description must be a string");
		}
		result.description = body.description.trim();
	}

	if (body.notes !== undefined) {
		if (typeof body.notes !== "string") {
			throw new ValidationError("notes must be a string");
		}
		result.notes = body.notes.trim();
	}

	return result;
};

export const validateAppointmentQuery = (query = {}) => {
	const result = {};

	if (query.practitionerId) {
		result.practitionerId = asTrimmedString(query.practitionerId, "practitionerId");
	}

	if (query.start) {
		result.start = ensureProvided(query.start, "start");
	}

	if (query.end) {
		result.end = ensureProvided(query.end, "end");
	}

	const limit = coerceLimit(query.limit);
	if (limit) {
		result.limit = limit;
	}

	return result;
};

export const extractPractitionerIdParam = (params = {}) => {
	if (!params.practitionerId || params.practitionerId === "me") {
		return undefined;
	}

	return asTrimmedString(params.practitionerId, "practitionerId");
};

export const validatePatientAppointmentQuery = (query = {}) => {
	const result = {};

	if (query.start) {
		result.start = ensureProvided(query.start, "start");
	}

	if (query.end) {
		result.end = ensureProvided(query.end, "end");
	}

	const limit = coerceLimit(query.limit);
	if (limit) {
		result.limit = limit;
	}

	return result;
};

export const extractPatientIdParam = (params = {}) => {
	if (!params.patientId || params.patientId === "me") {
		return undefined;
	}

	return asTrimmedString(params.patientId, "patientId");
};
