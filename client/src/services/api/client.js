import { DEFAULT_API_BASE_URL } from "../../common/utils/constants.js";

const resolvedBaseUrl = (import.meta.env?.VITE_API_URL ?? "").trim();
export const API_BASE_URL = resolvedBaseUrl || DEFAULT_API_BASE_URL;

let authToken = null;

export const setAuthToken = (token) => {
    authToken = token;
};

export const getAuthToken = () => authToken;

export const clearAuthToken = () => {
    authToken = null;
};

const buildHeaders = (headers = new Headers()) => {
    const merged = headers instanceof Headers ? headers : new Headers(headers);
    if (authToken && !merged.has("Authorization")) {
        merged.set("Authorization", `Bearer ${authToken}`);
    }
    return merged;
};

const parseBody = async (response) => {
    const text = await response.text();
    if (!text) return null;

    try {
        return JSON.parse(text);
    } catch (error) {
        console.warn("Failed to parse response JSON", error);
        return text;
    }
};

const buildRequestInit = (method, data, options = {}) => {
    const init = {
        method,
        ...options,
    };

    init.headers = buildHeaders(options.headers);

    if (data !== undefined) {
        const isFormData = typeof FormData !== "undefined" && data instanceof FormData;

        if (!isFormData && !init.headers.has("Content-Type")) {
            init.headers.set("Content-Type", "application/json");
        }

        init.body = isFormData ? data : JSON.stringify(data);
    }

    return init;
};

const resolveUrl = (path) => {
    if (!path) {
        throw new Error("A path is required for API requests");
    }

    if (/^https?:\/\//i.test(path)) {
        return path;
    }

    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return `${API_BASE_URL}${normalizedPath}`;
};

const handleResponse = async (response) => {
    const payload = await parseBody(response);

    if (!response.ok) {
        const message =
            (payload && (payload.message || payload.error)) || response.statusText || "Request failed";

        const error = new Error(message);
        error.status = response.status;
        error.data = payload;
        throw error;
    }

    return payload;
};

const request = async (path, { method = "GET", data, ...options } = {}) => {
    const init = buildRequestInit(method, data, options);
    const url = resolveUrl(path);

    try {
        const response = await fetch(url, init);
        return await handleResponse(response);
    } catch (error) {
        if (error?.name === "AbortError") {
            const abortError = new Error("The request was aborted. Please try again.");
            abortError.cause = error;
            throw abortError;
        }

        if (error?.name === "TypeError") {
            const networkError = new Error(
                "Unable to reach the server. Please verify your connection or try again shortly.",
            );
            networkError.cause = error;
            networkError.status = 0;
            throw networkError;
        }

        throw error;
    }
};

export const apiClient = {
    request,
    get: (path, options) => request(path, { ...options, method: "GET" }),
    post: (path, data, options) => request(path, { ...options, method: "POST", data }),
    put: (path, data, options) => request(path, { ...options, method: "PUT", data }),
    patch: (path, data, options) => request(path, { ...options, method: "PATCH", data }),
    delete: (path, options) => request(path, { ...options, method: "DELETE" }),
};
