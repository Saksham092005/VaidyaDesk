import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../../common/hooks/useAuth.js";

const INITIAL_FORM = {
  email: "",
  password: "",
};

export default function LoginPage() {
  const { login, status, error, isAuthenticated, clearError } = useAuth();
  const [formValues, setFormValues] = useState(INITIAL_FORM);
  const [formError, setFormError] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = location.state?.from?.pathname ?? "/dashboard";

  if (isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((previous) => ({ ...previous, [name]: value }));
    if (formError) setFormError(null);
    if (error) clearError?.();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setFormError(null);

    try {
      await login(formValues);
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setFormError(err.message || "We couldn't sign you in. Please try again.");
    }
  };

  const isSubmitting = status === "login";
  const feedbackMessage = formError || error;

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-slate-100">
      <div className="w-full max-w-md space-y-8 rounded-3xl border border-white/10 bg-white/5 p-10 shadow-2xl backdrop-blur">
        <div className="space-y-3 text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-lg font-semibold text-emerald-300">
            VD
          </div>
          <h1 className="text-3xl font-semibold">Welcome back</h1>
          <p className="text-sm text-slate-300">
            Sign in to orchestrate personalized Panchakarma journeys for your patients.
          </p>
        </div>

        {feedbackMessage && (
          <div className="rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {feedbackMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
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
              <label htmlFor="password" className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formValues.password}
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
            {isSubmitting ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-400">
          New to VaidyaDesk? {" "}
          <Link to="/register" className="font-semibold text-emerald-300 hover:text-emerald-200">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
