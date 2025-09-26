import Appointment from "../models/Appointment.js";

export const createAppointment = (payload) => Appointment.create(payload);

export const findAppointmentsByPractitioner = (practitionerId, { start, end, limit = 50 } = {}) => {
    const query = { practitioner: practitionerId };

    if (start || end) {
        query.startTime = {};
        if (start) query.startTime.$gte = start;
        if (end) query.startTime.$lte = end;
    }

    return Appointment.find(query)
        .populate("patient", "name email")
        .populate("resource", "name type location")
        .sort({ startTime: 1 })
        .limit(limit);
};

export const findAppointmentById = (id) =>
    Appointment.findById(id)
        .populate("patient", "name email")
        .populate("resource", "name type location");

export const findOverlappingAppointments = ({ practitionerId, resourceId, start, end }) => {
    const overlapCriteria = [
        {
            practitioner: practitionerId,
            startTime: { $lt: end },
            endTime: { $gt: start },
        },
    ];

    if (resourceId) {
        overlapCriteria.push({
            resource: resourceId,
            startTime: { $lt: end },
            endTime: { $gt: start },
        });
    }

    return Appointment.find({
        $and: [
            { status: { $ne: "cancelled" } },
            { $or: overlapCriteria },
        ],
    });
};

export const countUpcomingAppointments = (practitionerId, { from }) =>
    Appointment.countDocuments({ practitioner: practitionerId, startTime: { $gte: from } });

export const findUpcomingAppointments = (practitionerId, { from, to, limit = 5 } = {}) => {
    const query = { practitioner: practitionerId, startTime: { $gte: from } };
    if (to) {
        query.startTime.$lte = to;
    }

    return Appointment.find(query)
        .populate("patient", "name email")
        .sort({ startTime: 1 })
        .limit(limit);
};

export const findDistinctPatientsForPractitioner = (practitionerId) =>
    Appointment.distinct("patient", { practitioner: practitionerId });

export const findAppointmentsByPatient = (patientId, { start, end, limit = 50 } = {}) => {
    const query = { patient: patientId };

    if (start || end) {
        query.startTime = {};
        if (start) query.startTime.$gte = start;
        if (end) query.startTime.$lte = end;
    }

    return Appointment.find(query)
        .populate("practitioner", "name email")
        .populate("resource", "name type location")
        .sort({ startTime: 1 })
        .limit(limit);
};

export const countAppointmentsForPatient = (patientId) => Appointment.countDocuments({ patient: patientId });

export const countUpcomingAppointmentsForPatient = (patientId, { from }) =>
    Appointment.countDocuments({ patient: patientId, startTime: { $gte: from } });

export const findUpcomingAppointmentsForPatient = (patientId, { from, to, limit = 5 } = {}) => {
    const query = { patient: patientId, startTime: { $gte: from } };
    if (to) {
        query.startTime.$lte = to;
    }

    return Appointment.find(query)
        .populate("practitioner", "name email")
        .populate("resource", "name type location")
        .sort({ startTime: 1 })
        .limit(limit);
};

export const findRecentAppointmentsForPatient = (patientId, { before, limit = 5 } = {}) => {
    const query = { patient: patientId };

    if (before) {
        query.startTime = { $lt: before };
    }

    return Appointment.find(query)
        .populate("practitioner", "name email")
        .populate("resource", "name type location")
        .sort({ startTime: -1 })
        .limit(limit);
};
