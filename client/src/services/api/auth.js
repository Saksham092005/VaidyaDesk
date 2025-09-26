import { apiClient } from "./client.js";
import { API_ENDPOINTS } from "./endpoints.js";

export const login = (credentials, options) =>
  apiClient.post(API_ENDPOINTS.auth.login, credentials, options);

export const register = (payload, options) =>
  apiClient.post(API_ENDPOINTS.auth.register, payload, options);
