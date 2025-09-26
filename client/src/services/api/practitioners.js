import { apiClient } from "./client.js";
import { API_ENDPOINTS } from "./endpoints.js";
import { withQuery } from "./utils.js";

export const fetchOwnDashboard = (options) =>
    apiClient.get(API_ENDPOINTS.practitioners.dashboard.self, options);

export const fetchDashboardByPractitionerId = (practitionerId, options) => {
    if (!practitionerId) {
        throw new Error("practitionerId is required to fetch a dashboard");
    }

    const path = API_ENDPOINTS.practitioners.dashboard.byId(practitionerId);
    return apiClient.get(path, options);
};

export const fetchPractitionerAppointments = (filters, options) => {
    const path = withQuery(API_ENDPOINTS.appointments.root, filters);
    return apiClient.get(path, options);
};
