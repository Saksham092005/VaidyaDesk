import User from "../models/User.js";

export const findUserByEmail = (email) => User.findOne({ email: email.trim().toLowerCase() });

export const findUserById = (id) => User.findById(id);

export const createUser = (data) => User.create(data);

export const listPractitioners = () => User.find({ role: "practitioner", isActive: true });

export const listPatientsForPractitioner = (practitionerId) =>
	User.find({ role: "patient", practitionerId, isActive: true }).select("name email practitionerId");

export const assignPractitionerToPatient = (patientId, practitionerId) =>
	User.findOneAndUpdate(
		{ _id: patientId, role: "patient" },
		{ practitionerId },
		{ new: true },
	);
