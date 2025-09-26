import { apiClient } from "./client.js";
import { API_ENDPOINTS } from "./endpoints.js";
import { withQuery } from "./utils.js";

export const listTemplates = (filters, options) => {
    const path = withQuery(API_ENDPOINTS.templates.root, filters);
    return apiClient.get(path, options);
};

export const createTemplate = (payload, options) =>
    apiClient.post(API_ENDPOINTS.templates.root, payload, options);
