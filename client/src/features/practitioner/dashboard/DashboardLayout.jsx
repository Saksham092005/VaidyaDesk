import { NavLink, Outlet, useNavigate } from "react-router-dom";

import { useAuth } from "../../../common/hooks/useAuth.js";
import { DashboardProvider, useDashboard } from "./context/index.js";
import { PatientDashboardProvider, usePatientDashboard } from "../../patient/dashboard/context/index.js";

const practitionerNavigation = [
    { to: "/dashboard", label: "Overview" },
    { to: "/dashboard/schedule", label: "Schedule" },
    { to: "/dashboard/treatments", label: "Treatments" },
    { to: "/dashboard/patients", label: "Patients" },
];

const patientNavigation = [
    { to: "/dashboard", label: "Overview" },
    { to: "/dashboard/journey", label: "Schedule" },
    { to: "/dashboard/feedback", label: "Feedback" },
    { to: "/dashboard/profile", label: "Profile" },
];

const getNavLinkClassName = ({ isActive }) =>
    `flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition ${isActive
        ? "bg-emerald-500/20 text-emerald-200 shadow-lg shadow-emerald-500/20"
        : "text-slate-300 hover:bg-white/5"
    }`;

const getPatientNavLinkClassName = ({ isActive }) =>
    `whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] transition ${isActive
        ? "bg-emerald-500/20 text-emerald-200 shadow-lg shadow-emerald-500/20"
        : "text-slate-200 hover:bg-white/5"
    }`;

const PractitionerDashboardShell = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { isLoading, isRefreshing, error, refresh } = useDashboard();

    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });
    };

    const handleRefresh = () => {
        refresh();
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <header className="border-b border-white/10 bg-slate-900/70 backdrop-blur">
                <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500/20 text-lg font-semibold text-emerald-300">
                            VD
                        </span>
                        <div>
                            <p className="text-base font-semibold">VaidyaDesk Control Center</p>
                            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Panchakarma OS</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
                        <button
                            type="button"
                            onClick={handleRefresh}
                            disabled={isRefreshing || isLoading}
                            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-200 transition hover:border-emerald-400/50 hover:text-emerald-200 disabled:cursor-not-allowed disabled:border-white/5 disabled:text-slate-500"
                        >
                            {isRefreshing || isLoading ? (
                                <span className="h-3 w-3 animate-spin rounded-full border border-emerald-300 border-t-transparent" />
                            ) : null}
                            <span>{isRefreshing || isLoading ? "Refreshing" : "Refresh"}</span>
                        </button>
                        <div className="hidden text-right sm:block">
                            <p className="font-semibold text-slate-100">{user?.name ?? "Practitioner"}</p>
                            <p className="text-xs uppercase tracking-[0.25em] text-emerald-300">{user?.role ?? "member"}</p>
                        </div>
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-200 transition hover:border-emerald-400/50 hover:text-emerald-200"
                        >
                            Log out
                        </button>
                    </div>
                </div>
            </header>

            <div className="mx-auto flex w-full max-w-6xl flex-1 gap-6 px-6 py-10">
                <div className="lg:hidden">
                    <nav className="mb-6 flex gap-2 overflow-x-auto rounded-2xl border border-white/10 bg-white/5 p-2">
                        {practitionerNavigation.map(({ to, label }) => (
                            <NavLink
                                key={to}
                                to={to}
                                className={({ isActive }) =>
                                    `whitespace-nowrap rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] transition ${isActive ? "bg-emerald-500/20 text-emerald-200" : "text-slate-200 hover:bg-white/5"
                                    }`
                                }
                            >
                                {label}
                            </NavLink>
                        ))}
                    </nav>
                </div>

                <aside className="hidden w-64 flex-shrink-0 flex-col gap-2 rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl lg:flex">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Navigation</p>
                    <nav className="mt-4 flex flex-col gap-2">
                        {practitionerNavigation.map(({ to, label }) => (
                            <NavLink key={to} to={to} className={getNavLinkClassName}>
                                <span>{label}</span>
                            </NavLink>
                        ))}
                    </nav>
                </aside>

                <main className="min-h-[60vh] flex-1 space-y-8">
                    {isLoading ? (
                        <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-3xl border border-white/5 bg-white/5">
                            <span className="h-10 w-10 animate-spin rounded-full border-2 border-emerald-300 border-t-transparent" />
                            <p className="mt-4 text-xs uppercase tracking-[0.3em] text-slate-400">Loading dashboard</p>
                        </div>
                    ) : error ? (
                        <div className="space-y-4 rounded-3xl border border-rose-500/40 bg-rose-500/10 p-8 text-rose-50">
                            <div>
                                <p className="text-sm uppercase tracking-[0.3em]">Unable to load dashboard</p>
                                <p className="mt-2 text-sm text-rose-100/80">{error}</p>
                            </div>
                            <button
                                type="button"
                                onClick={handleRefresh}
                                className="rounded-full border border-rose-300/40 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-rose-100 transition hover:border-rose-200 hover:text-white"
                            >
                                Retry
                            </button>
                        </div>
                    ) : (
                        <Outlet />
                    )}
                </main>
            </div>
        </div>
    );
};

const PatientDashboardShell = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { isLoading, isRefreshing, error, refresh } = usePatientDashboard();

    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });
    };

    const handleRefresh = () => {
        refresh();
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <header className="border-b border-white/10 bg-slate-900/70 backdrop-blur">
                <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500/20 text-lg font-semibold text-emerald-300">
                            VD
                        </span>
                        <div>
                            <p className="text-base font-semibold">My Panchakarma Journey</p>
                            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Guided by VaidyaDesk</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
                        <button
                            type="button"
                            onClick={handleRefresh}
                            disabled={isRefreshing || isLoading}
                            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-200 transition hover:border-emerald-400/50 hover:text-emerald-200 disabled:cursor-not-allowed disabled:border-white/5 disabled:text-slate-500"
                        >
                            {isRefreshing || isLoading ? (
                                <span className="h-3 w-3 animate-spin rounded-full border border-emerald-300 border-t-transparent" />
                            ) : null}
                            <span>{isRefreshing || isLoading ? "Syncing" : "Refresh"}</span>
                        </button>
                        <div className="hidden text-right sm:block">
                            <p className="font-semibold text-slate-100">{user?.name ?? "Guest"}</p>
                            <p className="text-xs uppercase tracking-[0.25em] text-emerald-300">{user?.role ?? "member"}</p>
                        </div>
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-200 transition hover:border-emerald-400/50 hover:text-emerald-200"
                        >
                            Log out
                        </button>
                    </div>
                </div>
            </header>

            <main className="mx-auto w-full max-w-5xl px-6 py-10">
                <nav className="mb-6 flex gap-2 overflow-x-auto rounded-full border border-white/10 bg-white/5 p-2">
                    {patientNavigation.map(({ to, label }) => (
                        <NavLink key={to} to={to} className={getPatientNavLinkClassName}>
                            {label}
                        </NavLink>
                    ))}
                </nav>
                {isLoading ? (
                    <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-3xl border border-white/5 bg-white/5">
                        <span className="h-10 w-10 animate-spin rounded-full border-2 border-emerald-300 border-t-transparent" />
                        <p className="mt-4 text-xs uppercase tracking-[0.3em] text-slate-400">Loading your journey</p>
                    </div>
                ) : error ? (
                    <div className="space-y-4 rounded-3xl border border-rose-500/40 bg-rose-500/10 p-8 text-rose-50">
                        <div>
                            <p className="text-sm uppercase tracking-[0.3em]">Unable to load dashboard</p>
                            <p className="mt-2 text-sm text-rose-100/80">{error}</p>
                        </div>
                        <button
                            type="button"
                            onClick={handleRefresh}
                            className="rounded-full border border-rose-300/40 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-rose-100 transition hover:border-rose-200 hover:text-white"
                        >
                            Retry
                        </button>
                    </div>
                ) : (
                    <Outlet />
                )}
            </main>
        </div>
    );
};

const DashboardLayout = () => {
    const { user } = useAuth();

    if (user?.role === "patient") {
        return (
            <PatientDashboardProvider>
                <PatientDashboardShell />
            </PatientDashboardProvider>
        );
    }

    return (
        <DashboardProvider>
            <PractitionerDashboardShell />
        </DashboardProvider>
    );
};

export default DashboardLayout;
