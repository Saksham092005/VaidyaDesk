import { useCallback, useEffect, useMemo, useState } from "react";

import { requestOwnAppointment } from "../../../services/api/patients.js";
import { buildTreatmentLookup, findTreatmentById } from "../dashboard/utils/treatments.js";

const DEFAULT_DURATION_MINUTES = 60;

const toLocalInputValue = (date) => {
  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const entityId = (entity) => entity?._id ?? entity?.id ?? "";

const PatientBookingDialog = ({
  open,
  onClose,
  treatments = [],
  resources = [],
  practitioner,
  practitioners = [],
  onCreated,
}) => {
  const therapyCatalog = (treatments && treatments.length > 0) ? treatments : [];
  const treatmentLookup = useMemo(() => buildTreatmentLookup(therapyCatalog), [therapyCatalog]);

  const assignedPractitionerId = entityId(practitioner);
  const practitionerOptions = useMemo(() => {
    const mapped = practitioners.map((item) => ({ id: entityId(item), label: item.name }));
    if (assignedPractitionerId && !mapped.some((option) => option.id === assignedPractitionerId)) {
      mapped.push({ id: assignedPractitionerId, label: practitioner?.name ?? "Assigned practitioner" });
    }
    return mapped;
  }, [practitioners, assignedPractitionerId, practitioner?.name]);

  const createDefaultFormState = useCallback(() => {
    const nextSlot = new Date();
    nextSlot.setHours(nextSlot.getHours() + 4, 0, 0, 0);

    const defaultTreatment = therapyCatalog[0];
    return {
      treatmentId: defaultTreatment?.id ?? defaultTreatment?._id ?? "",
      resourceId: "",
      practitionerId: assignedPractitionerId || practitionerOptions[0]?.id || "",
      startTime: toLocalInputValue(nextSlot),
      durationMinutes: defaultTreatment?.durationMinutes || DEFAULT_DURATION_MINUTES,
      intentions: "",
      notes: "",
    };
  }, [therapyCatalog, assignedPractitionerId, practitionerOptions]);

  const [formState, setFormState] = useState(createDefaultFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const selectedTreatment = useMemo(
    () => findTreatmentById(treatmentLookup, formState.treatmentId) ?? null,
    [formState.treatmentId, treatmentLookup],
  );

  useEffect(() => {
    if (!open) return;
    setFormState(createDefaultFormState);
    setSuccess(null);
    setError(null);
  }, [open, createDefaultFormState]);

  useEffect(() => {
    if (!selectedTreatment) return;
    setFormState((prev) => ({
      ...prev,
      durationMinutes:
        selectedTreatment.durationMinutes || prev.durationMinutes || DEFAULT_DURATION_MINUTES,
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
    const start = formState.startTime ? new Date(formState.startTime) : null;
    if (!start || Number.isNaN(start.getTime())) {
      setError("Pick a valid start time");
      return;
    }

    const chosenPractitionerId = formState.practitionerId || assignedPractitionerId;
    if (!chosenPractitionerId) {
      setError("Select a practitioner before sending your request.");
      return;
    }

    const durationMinutes = Math.max(1, Number(formState.durationMinutes) || DEFAULT_DURATION_MINUTES);
    const end = new Date(start.getTime() + durationMinutes * 60 * 1000);

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = {
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        treatmentId: formState.treatmentId || undefined,
        resourceId: formState.resourceId || undefined,
        practitionerId: chosenPractitionerId,
        title: selectedTreatment?.name || "Therapy session",
        notes: formState.notes?.trim() || undefined,
        description: formState.intentions?.trim() || undefined,
      };

      const response = await requestOwnAppointment(payload);
      onCreated?.(response?.data ?? response);
      setSuccess("Request sent! Your practitioner will confirm the slot shortly.");
    } catch (err) {
      setError(err?.message || "Unable to request this slot. Please try a different time.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const treatmentOptions = therapyCatalog.map((treatment) => ({
    id: treatment._id ?? treatment.id,
    label: treatment.name,
  }));

  const resourceOptions = resources.map((resource) => ({
    id: resource._id ?? resource.id,
    label: resource.name,
  }));

  const showPractitionerSelect = practitionerOptions.length > 0 || assignedPractitionerId;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur">
      <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-slate-900/95 p-6 shadow-2xl">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Request a session</p>
          <h2 className="text-2xl font-semibold text-white">Book your next therapy visit</h2>
          <p className="text-sm text-slate-300">
            {practitioner?.name
              ? `Your request will be routed to ${practitioner.name} for confirmation.`
              : "Choose a time that works for you; the clinic will confirm shortly."}
          </p>
        </header>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {showPractitionerSelect ? (
            <label className="flex flex-col text-sm text-slate-200">
              Select your preferred practitioner
              <select
                value={formState.practitionerId}
                onChange={(event) => handleFieldChange("practitionerId", event.target.value)}
                className="mt-2 rounded-2xl border border-white/10 bg-slate-950 px-4 py-2 text-sm text-white focus:border-emerald-300 focus:outline-none"
              >
                <option value="">Select practitioner</option>
                {practitionerOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
              {assignedPractitionerId ? (
                <span className="mt-2 text-xs uppercase tracking-[0.25em] text-emerald-300">
                  Currently assigned to {practitioner?.name}. Selecting a different practitioner will update your assignment.
                </span>
              ) : null}
            </label>
          ) : null}

          <label className="flex flex-col text-sm text-slate-200">
            Preferred treatment
            <select
              value={formState.treatmentId}
              onChange={(event) => handleFieldChange("treatmentId", event.target.value)}
              className="mt-2 rounded-2xl border border-white/10 bg-slate-950 px-4 py-2 text-sm text-white focus:border-emerald-300 focus:outline-none"
            >
              <option value="">Custom wellness session</option>
              {treatmentOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col text-sm text-slate-200">
              Desired start time
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
                min={30}
                step={15}
                value={formState.durationMinutes}
                onChange={(event) => handleFieldChange("durationMinutes", event.target.value)}
                className="mt-2 rounded-2xl border border-white/10 bg-slate-950 px-4 py-2 text-sm text-white focus:border-emerald-300 focus:outline-none"
              />
            </label>
          </div>

          <label className="flex flex-col text-sm text-slate-200">
            Preferred room or resource
            <select
              value={formState.resourceId}
              onChange={(event) => handleFieldChange("resourceId", event.target.value)}
              className="mt-2 rounded-2xl border border-white/10 bg-slate-950 px-4 py-2 text-sm text-white focus:border-emerald-300 focus:outline-none"
            >
              <option value="">No preference</option>
              {resourceOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col text-sm text-slate-200">
            What are you hoping to focus on?
            <textarea
              rows={3}
              value={formState.intentions}
              onChange={(event) => handleFieldChange("intentions", event.target.value)}
              className="mt-2 rounded-2xl border border-white/10 bg-slate-950 px-4 py-2 text-sm text-white focus:border-emerald-300 focus:outline-none"
              placeholder="Example: Continue lymphatic detox, ease lower back tension, prep for seasonal cleanse."
            />
          </label>

          <label className="flex flex-col text-sm text-slate-200">
            Additional notes (optional)
            <textarea
              rows={3}
              value={formState.notes}
              onChange={(event) => handleFieldChange("notes", event.target.value)}
              className="mt-2 rounded-2xl border border-white/10 bg-slate-950 px-4 py-2 text-sm text-white focus:border-emerald-300 focus:outline-none"
              placeholder="Share scheduling conflicts, sensitivities, or post-care questions."
            />
          </label>

          {error ? (
            <div className="rounded-2xl border border-rose-400/40 bg-rose-500/10 p-4 text-sm text-rose-100">{error}</div>
          ) : null}
          {success ? (
            <div className="rounded-2xl border border-emerald-300/40 bg-emerald-500/10 p-4 text-sm text-emerald-100">{success}</div>
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
              <span>{isSubmitting ? "Sending" : "Send request"}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-300 transition hover-border-emerald-300/60 hover:text-emerald-100"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientBookingDialog;
