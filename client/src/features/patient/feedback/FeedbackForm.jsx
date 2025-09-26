import { useMemo, useState } from "react";

import { submitAppointmentFeedback } from "../../../services/api/appointments.js";
import { usePatientDashboard } from "../dashboard/context/index.js";

const FEEDBACK_LEVELS = [
    { value: 5, label: "Excellent" },
    { value: 4, label: "Good" },
    { value: 3, label: "Fair" },
    { value: 2, label: "Needs attention" },
    { value: 1, label: "Urgent concern" },
];

const FeedbackForm = () => {
    const { recentAppointments, upcomingAppointments, treatments, refresh } = usePatientDashboard();

    const treatmentLookup = useMemo(() => {
        const map = new Map();
        treatments.forEach((item) => {
            const id = item?.id ?? item?._id;
            if (id && !map.has(id)) {
                map.set(id, item);
            }
        });
        return map;
    }, [treatments]);

    const eligibleAppointments = useMemo(() => {
        const combined = [...(recentAppointments ?? []), ...(upcomingAppointments ?? [])];

        const seen = new Set();
        return combined
            .filter((appointment) => {
                const id = appointment._id ?? appointment.id;
                if (!id || seen.has(id)) return false;
                seen.add(id);
                return true;
            })
            .map((appointment) => {
                const treatment = appointment.treatmentId ? treatmentLookup.get(appointment.treatmentId) : null;
                const label =
                    treatment?.name ||
                    appointment.title ||
                    `Session on ${new Date(appointment.startTime ?? Date.now()).toLocaleDateString()}`;

                return {
                    id: appointment._id ?? appointment.id,
                    label,
                    scheduledFor: appointment.startTime,
                };
            });
    }, [recentAppointments, upcomingAppointments, treatmentLookup]);

    const [formState, setFormState] = useState({
        appointmentId: eligibleAppointments[0]?.id ?? "",
        rating: 5,
        experienceSummary: "",
        symptoms: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleFieldChange = (field, value) => {
        setFormState((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!formState.appointmentId) {
            setError("Select a session to review");
            return;
        }

        setIsSubmitting(true);
        setError(null);
        setSuccess(null);

        try {
            await submitAppointmentFeedback(formState.appointmentId, {
                rating: Number(formState.rating),
                experienceSummary: formState.experienceSummary.trim() || undefined,
                symptoms: formState.symptoms.trim() || undefined,
            });

            setSuccess("Thank you — your feedback has been recorded.");
            setFormState((prev) => ({
                appointmentId: prev.appointmentId,
                rating: 5,
                experienceSummary: "",
                symptoms: "",
            }));
            refresh?.();
        } catch (err) {
            setError(err?.message || "Unable to submit feedback right now.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (eligibleAppointments.length === 0) {
        return (
            <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 text-sm text-slate-300">
                Once you complete a therapy session, you’ll be able to share feedback from this screen.
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-slate-950/30">
            <header className="space-y-3">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Recovery reflections</p>
                <h1 className="text-2xl font-semibold text-white">Share how your session felt</h1>
                <p className="text-sm text-slate-300">
                    Tell your practitioner how you responded. Honest insights keep your Panchakarma journey personalized and safe.
                </p>
            </header>

            <label className="flex flex-col gap-2 text-sm text-slate-200">
                Session
                <select
                    value={formState.appointmentId}
                    onChange={(event) => handleFieldChange("appointmentId", event.target.value)}
                    className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white focus:border-emerald-300 focus:outline-none"
                >
                    {eligibleAppointments.map((appointment) => (
                        <option key={appointment.id} value={appointment.id}>
                            {appointment.label}
                        </option>
                    ))}
                </select>
            </label>

            <div className="space-y-2">
                <p className="text-sm text-slate-200">Overall response</p>
                <div className="flex flex-wrap gap-2">
                    {FEEDBACK_LEVELS.map((level) => (
                        <button
                            key={level.value}
                            type="button"
                            onClick={() => handleFieldChange("rating", level.value)}
                            className={`flex-1 min-w-[120px] rounded-2xl border px-3 py-2 text-xs font-semibold uppercase tracking-[0.3em] transition ${Number(formState.rating) === level.value
                                    ? "border-emerald-300/60 bg-emerald-500/20 text-emerald-100"
                                    : "border-white/10 bg-slate-950/70 text-slate-300 hover:border-emerald-300/40 hover:text-emerald-100"
                                }`}
                        >
                            {level.label}
                        </button>
                    ))}
                </div>
            </div>

            <label className="flex flex-col gap-2 text-sm text-slate-200">
                How did your body feel afterwards?
                <textarea
                    rows={4}
                    value={formState.experienceSummary}
                    onChange={(event) => handleFieldChange("experienceSummary", event.target.value)}
                    className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white focus:border-emerald-300 focus:outline-none"
                    placeholder="Share any changes in energy, digestion, sleep, or mood."
                />
            </label>

            <label className="flex flex-col gap-2 text-sm text-slate-200">
                Any discomfort or symptoms we should know about?
                <textarea
                    rows={3}
                    value={formState.symptoms}
                    onChange={(event) => handleFieldChange("symptoms", event.target.value)}
                    className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white focus:border-emerald-300 focus:outline-none"
                    placeholder="Headaches, soreness, anxiety spikes, etc."
                />
            </label>

            {error ? (
                <div className="rounded-2xl border border-rose-400/40 bg-rose-500/10 p-4 text-sm text-rose-100">{error}</div>
            ) : null}
            {success ? (
                <div className="rounded-2xl border border-emerald-300/40 bg-emerald-500/10 p-4 text-sm text-emerald-100">{success}</div>
            ) : null}

            <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-emerald-500/20 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-100 transition hover:border-emerald-300 hover:text-white disabled:cursor-not-allowed disabled:border-white/10 disabled:text-slate-500"
            >
                {isSubmitting ? (
                    <span className="h-3 w-3 animate-spin rounded-full border border-emerald-300 border-t-transparent" />
                ) : null}
                <span>{isSubmitting ? "Submitting" : "Submit feedback"}</span>
            </button>
        </form>
    );
};

export default FeedbackForm;
