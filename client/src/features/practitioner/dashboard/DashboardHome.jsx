import { useMemo } from "react";

import { useAuth } from "../../../common/hooks/useAuth.js";
import { formatAppointmentWindow } from "../../../common/utils/date.js";
import { useDashboard } from "./context/index.js";

const DashboardHome = () => {
  const { user } = useAuth();
  const { stats, upcomingAppointments, patients, treatments = [], resources } = useDashboard();

  const treatmentLookup = useMemo(() => {
    const map = new Map();
    (treatments ?? []).forEach((item) => {
      const id = item?.id ?? item?._id;
      if (id && !map.has(id)) {
        map.set(id, item);
      }
    });
    return map;
  }, [treatments]);

  const availableTreatments = treatments ?? [];

  const summaryTiles = [
    {
      label: "Sessions this week",
      value: stats.upcomingCount ?? 0,
      caption: "Scheduled over the next 7 days",
    },
    {
      label: "Active patients",
      value: stats.patientCount ?? patients.length,
      caption: "Connected to your care",
    },
    {
      label: "Treatment offers",
  value: stats.treatmentCount ?? availableTreatments.length,
      caption: "Fixed Panchakarma sessions ready to book",
    },
    {
      label: "Resources prepped",
      value: stats.resourceCount ?? resources.length,
      caption: "Rooms & equipment available",
    },
  ];

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-500/20 via-emerald-400/10 to-slate-900/60 p-8 shadow-xl">
        <p className="text-sm uppercase tracking-[0.3em] text-emerald-200">Welcome back</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">
          Namaste {user?.name ?? "practitioner"}, your Panchakarma studio is ready.
        </h1>
        <p className="mt-4 max-w-2xl text-sm text-slate-200">
          Review upcoming sessions, confirm treatment offers, and keep every patient’s journey flowing. This
          overview pulls live scheduling data so you can act with clarity.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-4">
        {summaryTiles.map((tile) => (
          <div
            key={tile.label}
            className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-slate-950/40"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{tile.label}</p>
            <p className="mt-4 text-3xl font-semibold text-white">{tile.value}</p>
            <p className="mt-2 text-sm text-slate-400">{tile.caption}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-slate-950/40">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Upcoming sessions</p>
              <p className="mt-1 text-lg font-semibold text-white">Next 7 days</p>
            </div>
          </div>

          <div className="space-y-3">
            {upcomingAppointments.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-white/10 bg-slate-900/60 p-5 text-sm text-slate-300">
                You have no sessions scheduled in the next few days. Create an appointment to see it here instantly.
              </p>
            ) : (
              upcomingAppointments.map((appointment) => {
                const window = formatAppointmentWindow(appointment.startTime, appointment.endTime);
                const treatment = appointment.treatmentId ? treatmentLookup.get(appointment.treatmentId) : null;
                const therapyName = treatment?.name ?? appointment.title ?? "Therapy session";
                const therapyDescription = treatment?.description ?? appointment.description ?? "Custom plan";
                return (
                  <div
                    key={appointment.id ?? appointment._id}
                    className="rounded-2xl border border-white/10 bg-slate-900/60 p-5"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-white">{therapyName}</p>
                        <p className="text-xs uppercase tracking-[0.3em] text-emerald-300">{window.dayLabel}</p>
                      </div>
                      <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200">
                        {window.timeLabel || "TBD"}
                      </span>
                    </div>
                    <div className="mt-3 grid gap-3 text-sm text-slate-300 sm:grid-cols-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Patient</p>
                        <p className="mt-1 text-slate-200">{appointment.patient?.name ?? "—"}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Therapy</p>
                        <p className="mt-1 text-slate-200">{therapyDescription}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Resource</p>
                        <p className="mt-1 text-slate-200">{appointment.resource?.name ?? "Any available"}</p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-slate-950/40">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Treatment lineup</p>
              <p className="mt-1 text-lg font-semibold text-white">Preset cleanse experiences</p>
            </div>
          </div>

          <div className="space-y-3">
            {availableTreatments.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-white/10 bg-slate-900/60 p-5 text-sm text-slate-300">
                Treatments sync automatically from the clinic presets. Connect with your admin if you need to adjust the list.
              </p>
            ) : (
              availableTreatments.slice(0, 4).map((treatment) => (
                <div key={treatment.id ?? treatment._id} className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-white">{treatment.name}</p>
                      {treatment.focusDosha ? (
                        <p className="text-xs uppercase tracking-[0.25em] text-emerald-300">{treatment.focusDosha}</p>
                      ) : null}
                      {treatment.idealPhase ? (
                        <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500">{treatment.idealPhase}</p>
                      ) : null}
                    </div>
                    <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-300">
                      {treatment.durationMinutes ? `${treatment.durationMinutes} min` : "Flexible"}
                    </span>
                  </div>
                  {treatment.description ? (
                    <p className="mt-3 text-sm text-slate-300">{treatment.description}</p>
                  ) : null}
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-dashed border-emerald-400/30 bg-emerald-500/10 p-6 text-sm text-emerald-100">
        <p className="font-semibold uppercase tracking-[0.3em]">Your care network</p>
        <p className="mt-3 text-emerald-50">
          {patients.length > 0
            ? `You are currently overseeing ${patients.length} active patient${patients.length === 1 ? "" : "s"}.`
            : "Invite patients to connect with your practice and track their progress here."}
        </p>
        {resources.length > 0 ? (
          <p className="mt-2 text-xs uppercase tracking-[0.3em] text-emerald-200">
            {resources.length} resource{resources.length === 1 ? "" : "s"} ready • {availableTreatments.length} treatment
            {availableTreatments.length === 1 ? "" : "s"} published
          </p>
        ) : null}
      </section>
    </div>
  );
};

export default DashboardHome;
