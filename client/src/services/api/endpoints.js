export const API_ENDPOINTS = {
    auth: {
        login: "/auth/login",
        register: "/auth/register",
    },
    practitioners: {
        dashboard: {
            self: "/practitioners/me/dashboard",
            byId: (practitionerId) => `/practitioners/${practitionerId}/dashboard`,
        },
    },
    patients: {
        dashboard: {
            self: "/patients/me/dashboard",
            byId: (patientId) => `/patients/${patientId}/dashboard`,
        },
        appointments: {
            self: "/patients/me/appointments",
            byId: (patientId) => `/patients/${patientId}/appointments`,
        },
    },
    appointments: {
        root: "/appointments",
        feedback: (appointmentId) => `/appointments/${appointmentId}/feedback`,
    },
};

export default API_ENDPOINTS;
