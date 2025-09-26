import { useCallback, useEffect, useMemo, useState } from "react";

import { fetchOwnDashboard } from "../../../../services/api/practitioners.js";
import { DashboardContext } from "./dashboardContext.js";

const EMPTY_DASHBOARD = {
    stats: {
        upcomingCount: 0,
        patientCount: 0,
        treatmentCount: 0,
        resourceCount: 0,
    },
    upcomingAppointments: [],
    patients: [],
    treatments: [],
    resources: [],
};

const normalizeDashboardPayload = (payload) => {
    if (!payload || typeof payload !== "object") {
        return EMPTY_DASHBOARD;
    }

    const {
        stats = {},
        upcomingAppointments = [],
        patients = [],
        treatments = [],
        resources = [],
    } = payload;

    const treatmentList = Array.isArray(treatments) ? treatments : [];

    return {
        stats: {
            ...EMPTY_DASHBOARD.stats,
            ...stats,
            treatmentCount: treatmentList.length,
            resourceCount: resources.length,
        },
        upcomingAppointments,
        patients,
        treatments: treatmentList,
        resources,
    };
};

export function DashboardProvider({ children }) {
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

            const message = err?.message || "Unable to load dashboard data.";
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
            patients: data.patients,
            treatments: data.treatments,
            resources: data.resources,
            isLoading: status === "loading",
            isRefreshing: status === "refreshing",
            error,
            refresh,
        }),
        [data, status, error, refresh],
    );

    return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}
