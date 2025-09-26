import { useMemo } from "react";

import TREATMENT_OFFERS from "../../../../../shared/constants/treatments.js";
import { useDashboard } from "./context/index.js";

const DashboardTreatments = () => {
  const { treatments = [], resources = [] } = useDashboard();

  const availableTreatments = useMemo(() => {
    if (treatments && treatments.length > 0) {
      return treatments;
    }

    return TREATMENT_OFFERS;
  }, [treatments]);

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-slate-950/40">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Treatment catalogue</p>
            <h1 className="mt-1 text-2xl font-semibold text-white">Preset Panchakarma offerings</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              These curated therapies cover the essential Panchakarma flow—select them when scheduling to auto-fill names,
              durations, and guidance. Custom notes are still available for patient-specific adjustments.
            </p>
          </div>
        </header>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {availableTreatments.map((treatment) => (
            <article
              key={treatment.id}
              className="flex flex-col rounded-2xl border border-white/10 bg-slate-900/60 p-5 shadow-inner shadow-emerald-500/5"
            >
              <header className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-base font-semibold text-white">{treatment.name}</p>
                  {treatment.focusDosha ? (
                    <p className="text-xs uppercase tracking-[0.25em] text-emerald-300">{treatment.focusDosha}</p>
                  ) : null}
                  {treatment.idealPhase ? (
                    <p className="mt-1 text-xs uppercase tracking-[0.25em] text-slate-500">{treatment.idealPhase}</p>
                  ) : null}
                </div>
                <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-300">
                  {treatment.durationMinutes ? `${treatment.durationMinutes} min` : "Flexible"}
                </span>
              </header>

              <p className="mt-4 text-sm text-slate-300">{treatment.description}</p>

              {treatment.recommendedResources?.length ? (
                <div className="mt-4 space-y-2">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Recommended resources</p>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {treatment.recommendedResources.map((resource) => (
                      <li key={`${treatment.id}-${resource}`} className="flex items-center gap-2">
                        <span className="h-1 w-1 rounded-full bg-emerald-300" />
                        <span>{resource}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {treatment.steps?.length ? (
                <div className="mt-4 space-y-3">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Session outline</p>
                  <ol className="space-y-2 text-xs text-slate-200">
                    {treatment.steps.map((step, index) => (
                      <li
                        key={`${treatment.id}-step-${index}`}
                        className="rounded-xl border border-white/10 bg-slate-900/70 p-3"
                      >
                        <p className="font-semibold text-white">{step.name}</p>
                        {step.durationMinutes ? (
                          <p className="text-[10px] uppercase tracking-[0.35em] text-emerald-300">
                            {step.durationMinutes} min
                          </p>
                        ) : null}
                        {step.description ? (
                          <p className="mt-2 text-[11px] text-slate-300">{step.description}</p>
                        ) : null}
                        {step.instructions?.length ? (
                          <ul className="mt-2 list-disc space-y-1 pl-4 text-[11px] text-slate-400">
                            {step.instructions.map((instruction, instructionIndex) => (
                              <li key={`instruction-${instructionIndex}`}>{instruction}</li>
                            ))}
                          </ul>
                        ) : null}
                      </li>
                    ))}
                  </ol>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-emerald-400/40 bg-emerald-500/10 p-6 shadow-lg shadow-emerald-500/20">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-200">Operational guidance</p>
            <h2 className="mt-1 text-2xl font-semibold text-white">How to use these treatments</h2>
          </div>
        </header>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/20 bg-slate-950/70 p-4 text-sm text-emerald-100/80">
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-300">Scheduling workflow</p>
            <p className="mt-2 text-sm">
              Choose a treatment when creating appointments to auto-fill titles, durations, and patient-facing descriptions.
              Add notes for personalised prep or follow-up.
            </p>
          </div>
          <div className="rounded-2xl border border-white/20 bg-slate-950/70 p-4 text-sm text-emerald-100/80">
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-300">Resource pairing</p>
            <p className="mt-2 text-sm">
              Reserve rooms or equipment that match the recommended resources. The scheduling engine will flag conflicts using
              the same IDs.
            </p>
          </div>
          <div className="rounded-2xl border border-white/20 bg-slate-950/70 p-4 text-sm text-emerald-100/80">
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-300">Customization tips</p>
            <p className="mt-2 text-sm">
              Need variations? Duplicate the appointment with a new title or adjust duration on the fly—no additional builder
              required.
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-xs text-emerald-100/70">
          <p>
            Resources configured in your clinic ({resources.length}) stay in sync with these recommendations. Update the
            Resources tab if you add new spaces or equipment.
          </p>
        </div>
      </section>
    </div>
  );
};

export default DashboardTreatments;
