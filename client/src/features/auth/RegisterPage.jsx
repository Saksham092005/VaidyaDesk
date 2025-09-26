import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import { useAuth } from "../../common/hooks/useAuth.js";

const INITIAL_FORM = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "patient",
};

const ROLE_OPTIONS = [
    { value: "patient", label: "Patient" },
    { value: "practitioner", label: "Practitioner" },
];

export default function RegisterPage() {
    const { register, status, error, isAuthenticated, clearError } = useAuth();
    const [formValues, setFormValues] = useState(INITIAL_FORM);
    const [formError, setFormError] = useState(null);

    const navigate = useNavigate();

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormValues((previous) => ({ ...previous, [name]: value }));
        if (formError) setFormError(null);
        if (error) clearError?.();
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (formValues.password !== formValues.confirmPassword) {
            setFormError("Passwords do not match. Please try again.");
            return;
        }

        setFormError(null);

        try {
            await register({
                name: formValues.name.trim(),
                email: formValues.email.trim().toLowerCase(),
                password: formValues.password,
                role: formValues.role,
            });

            navigate("/dashboard", { replace: true });
        } catch (err) {
            setFormError(err.message || "We couldn't create your account. Please try again.");
        }
    };

    const isSubmitting = status === "register";
    const feedbackMessage = formError || error;

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-slate-100">
            <div className="w-full max-w-2xl space-y-8 rounded-3xl border border-white/10 bg-white/5 p-10 shadow-2xl backdrop-blur">
                <div className="space-y-3 text-center">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-lg font-semibold text-emerald-300">
                        VD
                    </div>
                    <h1 className="text-3xl font-semibold">Create your account</h1>
                    <p className="text-sm text-slate-300">
                        Join VaidyaDesk to automate Panchakarma scheduling, notifications, and patient care.
                    </p>
                </div>

                {feedbackMessage && (
                    <div className="rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                        {feedbackMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="text-left md:col-span-2">
                            <label htmlFor="name" className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
                                Full name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                autoComplete="name"
                                required
                                value={formValues.name}
                                onChange={handleChange}
                                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                            />
                        </div>

                        <div className="text-left">
                            <label htmlFor="email" className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={formValues.email}
                                onChange={handleChange}
                                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                            />
                        </div>

                        <div className="text-left">
                            <label htmlFor="role" className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
                                Role
                            </label>
                            <select
                                id="role"
                                name="role"
                                value={formValues.role}
                                onChange={handleChange}
                                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                            >
                                {ROLE_OPTIONS.map((option) => (
                                    <option key={option.value} value={option.value} className="bg-slate-900">
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="text-left">
                            <label htmlFor="password" className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                value={formValues.password}
                                onChange={handleChange}
                                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                            />
                        </div>

                        <div className="text-left">
                            <label htmlFor="confirmPassword" className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
                                Confirm password
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                autoComplete="new-password"
                                required
                                value={formValues.confirmPassword}
                                onChange={handleChange}
                                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex w-full items-center justify-center rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/40 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {isSubmitting ? "Creating account…" : "Create account"}
                    </button>
                </form>

                <p className="text-center text-sm text-slate-400">
                    Already have an account? {" "}
                    <Link to="/login" className="font-semibold text-emerald-300 hover:text-emerald-200">
                        Sign in instead
                    </Link>
                </p>
            </div>
        </div>
    );
}
