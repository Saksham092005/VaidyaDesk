import { useEffect, useMemo, useState } from "react";

import { createAppointment } from "../../../../services/api/appointments.js";

const DEFAULT_DURATION_MINUTES = 60;

const toLocalInputValue = (date) => {
    const pad = (value) => String(value).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const AppointmentCreateDialog = ({ open, onClose, patients = [], treatments = [], resources = [], onCreated }) => {
    const defaultPatientId = patients[0]?._id ?? patients[0]?.id ?? "";

    const availableTreatments = useMemo(() => treatments ?? [], [treatments]);

    const [formState, setFormState] = useState(() => {
        const now = new Date();
        now.setMinutes(now.getMinutes() + 30 - (now.getMinutes() % 15));
        return {
            patientId: defaultPatientId,
            treatmentId: "",
            resourceId: "",
            startTime: toLocalInputValue(now),
            durationMinutes: DEFAULT_DURATION_MINUTES,
            title: "",
            notes: "",
        };
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const selectedTreatment = useMemo(() => {
        if (!formState.treatmentId) return null;

        return (
            availableTreatments.find((treatment) => (treatment.id ?? treatment._id) === formState.treatmentId) ?? null
        );
    }, [formState.treatmentId, availableTreatments]);

    useEffect(() => {
        if (!open) return;

        setFormState((prev) => ({
            ...prev,
            patientId: prev.patientId || defaultPatientId,
            treatmentId: "",
        }));
    }, [open, defaultPatientId]);

    useEffect(() => {
        if (!selectedTreatment) return;
        setFormState((prev) => ({
            ...prev,
            durationMinutes: selectedTreatment.durationMinutes || prev.durationMinutes || DEFAULT_DURATION_MINUTES,
            title: prev.title?.length ? prev.title : selectedTreatment.name,
        }));
    }, [selectedTreatment]);

    if (!open) {
        return null;
    }

    const handleFieldChange = (field, value) => {
        setFormState((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!formState.patientId) {
            setError("Select a patient to schedule");
            return;
        }

        const start = formState.startTime ? new Date(formState.startTime) : null;
        if (!start || Number.isNaN(start.getTime())) {
            setError("Choose a valid start time");
            return;
        }

        const durationMinutes = Math.max(1, Number(formState.durationMinutes) || DEFAULT_DURATION_MINUTES);
        const end = new Date(start.getTime() + durationMinutes * 60 * 1000);

        setIsSubmitting(true);
        setError(null);

        try {
            const treatmentId = formState.treatmentId || undefined;

            const payload = {
                patientId: formState.patientId,
                startTime: start.toISOString(),
                endTime: end.toISOString(),
                title: formState.title?.trim() || undefined,
                notes: formState.notes?.trim() || undefined,
                treatmentId,
                resourceId: formState.resourceId || undefined,
            };

            const response = await createAppointment(payload);
            onCreated?.(response?.data ?? response);
            onClose?.();
        } catch (err) {
            setError(err?.message || "Unable to schedule the appointment.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const patientOptions = patients.map((patient) => ({
        id: patient._id ?? patient.id,
        label: patient.name ?? "Unnamed patient",
    }));

    const treatmentOptions = availableTreatments.map((treatment) => ({
        id: treatment._id ?? treatment.id,
        label: treatment.name,
    }));

    const resourceOptions = resources.map((resource) => ({
        id: resource._id ?? resource.id,
        label: resource.name,
    }));

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur">
            <div className="w-full max-w-3xl rounded-3xl border border-white/10 bg-slate-900/95 p-6 shadow-2xl">
                <header className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">New appointment</p>
                        <h2 className="mt-2 text-2xl font-semibold text-white">Schedule a therapy session</h2>
                        <p className="mt-2 text-sm text-slate-300">
                            Assign a Panchakarma treatment, pick the timing, and reserve resources. Conflicts are checked automatically.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-300 transition hover:border-emerald-300/60 hover:text-emerald-100"
                    >
                        Close
                    </button>
                </header>

                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                    <div className="grid gap-4 md:grid-cols-2">
                        <label className="flex flex-col text-sm text-slate-200">
                            Patient
                            <select
                                value={formState.patientId}
                                onChange={(event) => handleFieldChange("patientId", event.target.value)}
                                className="mt-2 rounded-2xl border border-white/10 bg-slate-950 px-4 py-2 text-sm text-white focus:border-emerald-300 focus:outline-none"
                            >
                                <option value="" disabled>
                                    Select patient
                                </option>
                                {patientOptions.map((option) => (
                                    <option key={option.id} value={option.id}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="flex flex-col text-sm text-slate-200">
                            Treatment (optional)
                            <select
                                value={formState.treatmentId}
                                onChange={(event) => handleFieldChange("treatmentId", event.target.value)}
                                className="mt-2 rounded-2xl border border-white/10 bg-slate-950 px-4 py-2 text-sm text-white focus:border-emerald-300 focus:outline-none"
                            >
                                <option value="">Custom session</option>
                                {treatmentOptions.map((option) => (
                                    <option key={option.id} value={option.id}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <label className="flex flex-col text-sm text-slate-200">
                            Start time
                            <input
                                type="datetime-local"
                                value={formState.startTime}
                                onChange={(event) => handleFieldChange("startTime", event.target.value)}
                                className="mt-2 rounded-2xl border border-white/10 bg-slate-950 px-4 py-2 text-sm text-white focus:border-emerald-300 focus:outline-none"
                            />
                        </label>
                        <label className="flex flex-col text-sm text-slate-200">
                            Duration (minutes)
                            <input
                                type="number"
                                min={15}
                                step={15}
                                value={formState.durationMinutes}
                                onChange={(event) => handleFieldChange("durationMinutes", event.target.value)}
                                className="mt-2 rounded-2xl border border-white/10 bg-slate-950 px-4 py-2 text-sm text-white focus:border-emerald-300 focus:outline-none"
                            />
                        </label>
                    </div>

                    <label className="flex flex-col text-sm text-slate-200">
                        Reserve resource (optional)
                        <select
                            value={formState.resourceId}
                            onChange={(event) => handleFieldChange("resourceId", event.target.value)}
                            className="mt-2 rounded-2xl border border-white/10 bg-slate-950 px-4 py-2 text-sm text-white focus:border-emerald-300 focus:outline-none"
                        >
                            <option value="">Any available</option>
                            {resourceOptions.map((option) => (
                                <option key={option.id} value={option.id}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="flex flex-col text-sm text-slate-200">
                        Session title
                        <input
                            type="text"
                            value={formState.title}
                            onChange={(event) => handleFieldChange("title", event.target.value)}
                            placeholder="Shirodhara focus or custom name"
                            className="mt-2 rounded-2xl border border-white/10 bg-slate-950 px-4 py-2 text-sm text-white focus:border-emerald-300 focus:outline-none"
                        />
                    </label>

                    <label className="flex flex-col text-sm text-slate-200">
                        Notes for your patient (optional)
                        <textarea
                            rows={3}
                            value={formState.notes}
                            onChange={(event) => handleFieldChange("notes", event.target.value)}
                            className="mt-2 rounded-2xl border border-white/10 bg-slate-950 px-4 py-2 text-sm text-white focus:border-emerald-300 focus:outline-none"
                            placeholder="Hydration reminders, prep instructions, etc."
                        />
                    </label>

                    {error ? (
                        <div className="rounded-2xl border border-rose-400/40 bg-rose-500/10 p-4 text-sm text-rose-100">{error}</div>
                    ) : null}

                    <div className="flex items-center gap-3">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="inline-flex items-center gap-2 rounded-full border border-emerald-300/60 bg-emerald-500/20 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-100 transition hover:border-emerald-300 hover:text-white disabled:cursor-not-allowed disabled:border-white/10 disabled:text-slate-500"
                        >
                            {isSubmitting ? (
                                <span className="h-3 w-3 animate-spin rounded-full border border-emerald-300 border-t-transparent" />
                            ) : null}
                            <span>{isSubmitting ? "Scheduling" : "Schedule session"}</span>
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-300 transition hover:border-emerald-300/60 hover:text-emerald-100"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AppointmentCreateDialog;
