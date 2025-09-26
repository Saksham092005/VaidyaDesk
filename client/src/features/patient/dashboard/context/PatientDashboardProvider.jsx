import { useCallback, useEffect, useMemo, useState } from "react";

import { fetchOwnDashboard } from "../../../../services/api/patients.js";
import { PatientDashboardContext } from "./patientDashboardContext.js";

const EMPTY_DASHBOARD = {
    stats: {
        upcomingCount: 0,
        totalAppointments: 0,
    },
    upcomingAppointments: [],
    recentAppointments: [],
    practitioner: null,
    patient: null,
    treatments: [],
    resources: [],
    practitioners: [],
};

const normalizeDashboardPayload = (payload) => {
    if (!payload || typeof payload !== "object") {
        return EMPTY_DASHBOARD;
    }

    const {
        stats = {},
        upcomingAppointments = [],
        recentAppointments = [],
        practitioner = null,
        patient = null,
        treatments = [],
        resources = [],
        practitioners = [],
    } = payload;

    const treatmentList = Array.isArray(treatments) ? treatments : [];

    return {
        stats: {
            ...EMPTY_DASHBOARD.stats,
            ...stats,
        },
        upcomingAppointments,
        recentAppointments,
        practitioner,
        patient,
        treatments: treatmentList,
        resources,
        practitioners,
    };
};

export function PatientDashboardProvider({ children }) {
    const [data, setData] = useState(EMPTY_DASHBOARD);
    const [status, setStatus] = useState("idle");
    const [error, setError] = useState(null);

    const fetchDashboard = useCallback(async ({ signal, mode = "loading" } = {}) => {
        setStatus(mode);
        setError(null);

        try {
            const response = await fetchOwnDashboard({ signal });
            const payload = normalizeDashboardPayload(response?.data ?? response);

            if (signal?.aborted) {
                return;
            }

            setData(payload);
        } catch (err) {
            if (err?.name === "AbortError" || signal?.aborted) {
                return;
            }

            const message = err?.message || "Unable to load your dashboard right now.";
            setError(message);
        } finally {
            if (!signal?.aborted) {
                setStatus("idle");
            }
        }
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        fetchDashboard({ signal: controller.signal, mode: "loading" });

        return () => {
            controller.abort();
        };
    }, [fetchDashboard]);

    const refresh = useCallback(() => fetchDashboard({ mode: "refreshing" }), [fetchDashboard]);

    const value = useMemo(
        () => ({
            ...data,
            stats: data.stats,
            upcomingAppointments: data.upcomingAppointments,
            recentAppointments: data.recentAppointments,
            practitioner: data.practitioner,
            patient: data.patient,
            treatments: data.treatments,
            resources: data.resources,
            practitioners: data.practitioners,
            isLoading: status === "loading",
            isRefreshing: status === "refreshing",
            error,
            refresh,
        }),
        [data, status, error, refresh],
    );

    return <PatientDashboardContext.Provider value={value}>{children}</PatientDashboardContext.Provider>;
}
