import { createContext, useCallback, useEffect, useMemo, useState } from "react";

import { AUTH_STORAGE_KEY } from "../utils/constants.js";
import { clearAuthToken, setAuthToken } from "../../services/api/client.js";
import { login as loginRequest, register as registerRequest } from "../../services/api/auth.js";

const AuthContext = createContext(undefined);
AuthContext.displayName = "AuthContext";

const readStoredAuth = () => {
    try {
        const raw = localStorage.getItem(AUTH_STORAGE_KEY);
        if (!raw) return null;
        return JSON.parse(raw);
    } catch (error) {
        console.warn("Failed to parse stored auth payload", error);
        return null;
    }
};

const persistAuth = (token, user) => {
    try {
        if (token && user) {
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ token, user }));
        } else {
            localStorage.removeItem(AUTH_STORAGE_KEY);
        }
    } catch (error) {
        console.warn("Failed to persist auth state", error);
    }
};

const extractAuthPayload = (payload) => {
    if (!payload) return { token: null, user: null };
    if (payload.data) return extractAuthPayload(payload.data);

    const { token = null, user = null } = payload;
    return { token, user };
};

const extractErrorMessage = (error, fallback) => {
    if (!error) return fallback;
    if (error?.data?.message) return error.data.message;
    if (error?.data?.error) return error.data.error;
    if (error?.message) return error.message;
    return fallback;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [status, setStatus] = useState("idle");
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const applyAuth = useCallback((nextToken, nextUser) => {
        if (nextToken && nextUser) {
            setToken(nextToken);
            setUser(nextUser);
            setAuthToken(nextToken);
            persistAuth(nextToken, nextUser);
        } else {
            setToken(null);
            setUser(null);
            clearAuthToken();
            persistAuth(null, null);
        }
    }, []);

    useEffect(() => {
        const stored = readStoredAuth();
        if (stored?.token && stored?.user) {
            applyAuth(stored.token, stored.user);
        } else {
            clearAuthToken();
        }
        setIsLoading(false);
    }, [applyAuth]);

    const handleAuthSuccess = useCallback(
        (payload) => {
            const { token: nextToken, user: nextUser } = extractAuthPayload(payload);
            if (!nextToken || !nextUser) {
                throw new Error("Invalid authentication response.");
            }

            applyAuth(nextToken, nextUser);
            return nextUser;
        },
        [applyAuth],
    );

    const login = useCallback(
        async (credentials) => {
            setStatus("login");
            setError(null);
            try {
                const response = await loginRequest(credentials);
                return handleAuthSuccess(response);
            } catch (err) {
                const message = extractErrorMessage(err, "Unable to sign in. Please try again.");
                setError(message);
                throw new Error(message);
            } finally {
                setStatus("idle");
            }
        },
        [handleAuthSuccess],
    );

    const register = useCallback(
        async (payload) => {
            setStatus("register");
            setError(null);
            try {
                const response = await registerRequest(payload);
                return handleAuthSuccess(response);
            } catch (err) {
                const message = extractErrorMessage(err, "Registration failed. Please check the details and try again.");
                setError(message);
                throw new Error(message);
            } finally {
                setStatus("idle");
            }
        },
        [handleAuthSuccess],
    );

    const logout = useCallback(() => {
        applyAuth(null, null);
    }, [applyAuth]);

    const value = useMemo(
        () => ({
            user,
            token,
            status,
            error,
            isLoading,
            isAuthenticated: Boolean(token),
            login,
            register,
            logout,
            clearError: () => setError(null),
        }),
        [user, token, status, error, isLoading, login, register, logout],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext };
