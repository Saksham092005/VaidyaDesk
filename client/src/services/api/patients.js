import { apiClient } from "./client.js";
import { API_ENDPOINTS } from "./endpoints.js";
import { withQuery } from "./utils.js";

export const fetchOwnDashboard = (options) =>
    apiClient.get(API_ENDPOINTS.patients.dashboard.self, options);

export const fetchDashboardByPatientId = (patientId, options) => {
    if (!patientId) {
        throw new Error("patientId is required to fetch a dashboard");
    }

    const path = API_ENDPOINTS.patients.dashboard.byId(patientId);
    return apiClient.get(path, options);
};

export const listOwnAppointments = (filters, options) => {
    const path = withQuery(API_ENDPOINTS.patients.appointments.self, filters);
    return apiClient.get(path, options);
};

export const requestOwnAppointment = (payload, options) =>
    apiClient.post(API_ENDPOINTS.patients.appointments.self, payload, options);

export const listAppointmentsByPatientId = (patientId, filters, options) => {
    if (!patientId) {
        throw new Error("patientId is required to list appointments");
    }

    const path = withQuery(API_ENDPOINTS.patients.appointments.byId(patientId), filters);
    return apiClient.get(path, options);
};
