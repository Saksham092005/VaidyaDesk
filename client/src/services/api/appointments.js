import { apiClient } from "./client.js";
import { API_ENDPOINTS } from "./endpoints.js";
import { withQuery } from "./utils.js";

export const listAppointments = (filters, options) => {
  const path = withQuery(API_ENDPOINTS.appointments.root, filters);
  return apiClient.get(path, options);
};

export const createAppointment = (payload, options) =>
  apiClient.post(API_ENDPOINTS.appointments.root, payload, options);

export const submitAppointmentFeedback = (appointmentId, payload, options) => {
  if (!appointmentId) {
    throw new Error("appointmentId is required to submit feedback");
  }

  return apiClient.post(API_ENDPOINTS.appointments.feedback(appointmentId), payload, options);
};
