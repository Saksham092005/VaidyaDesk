import { useMemo } from "react";

import {
  formatAppointmentWindow,
  formatDate,
  formatTime,
} from "../../../common/utils/date.js";
import { usePatientDashboard } from "./context/index.js";
import { buildTreatmentLookup, findTreatmentById, resolveTreatmentName } from "./utils/treatments.js";

const PatientDashboardHome = () => {
  const {
    stats,
    patient,
    practitioner,
    upcomingAppointments,
    recentAppointments,
    treatments,
    resources,
  } = usePatientDashboard();

  const treatmentLookup = useMemo(() => buildTreatmentLookup(treatments), [treatments]);

  const getTreatmentName = (appointment) => resolveTreatmentName(appointment, treatmentLookup);
  const getTreatmentForAppointment = (appointment) =>
    appointment?.treatmentId ? findTreatmentById(treatmentLookup, appointment.treatmentId) : null;

  const summaryTiles = [
    {
      label: "Upcoming sessions",
      value: stats.upcomingCount ?? upcomingAppointments.length,
      caption: "Scheduled over the next few days",
    },
    {
      label: "Completed so far",
      value: (stats.totalAppointments ?? 0) - (stats.upcomingCount ?? 0),
      caption: "Therapies you've already finished",
    },
    {
      label: "Treatments in plan",
      value: treatments.length,
      caption: "Protocols guiding your cleanse",
    },
  ];

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-500/20 via-emerald-400/10 to-slate-900/60 p-8 shadow-xl">
        <p className="text-sm uppercase tracking-[0.3em] text-emerald-200">Welcome</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">
          {patient?.name ? `Hi ${patient.name}, your Panchakarma journey continues.` : "Stay steady through every cleanse step."}
        </h1>
        <p className="mt-4 max-w-2xl text-sm text-slate-200">
          Track upcoming sessions, reflect on recent therapies, and stay connected with your practitioner. Visit the
          Schedule tab to manage bookings and the Profile tab to review spaces and support prepared for you—everything
          refreshes automatically whenever your care team makes an update.
        </p>
        {practitioner ? (
          <p className="mt-5 text-xs uppercase tracking-[0.3em] text-emerald-200">
            Guided by {practitioner.name} {practitioner.email ? `· ${practitioner.email}` : ""}
          </p>
        ) : null}
      </section>

      <section className="grid gap-6 md:grid-cols-3">
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
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Next sessions</p>
              <p className="mt-1 text-lg font-semibold text-white">Stay prepared</p>
            </div>
          </div>

          <div className="space-y-3">
            {upcomingAppointments.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-white/10 bg-slate-900/60 p-5 text-sm text-slate-300">
                Your practitioner hasn’t scheduled new sessions yet. You’ll see the details here as soon as they’re
                confirmed.
              </p>
            ) : (
              upcomingAppointments.map((appointment) => {
                const window = formatAppointmentWindow(appointment.startTime, appointment.endTime);
                const treatment = getTreatmentForAppointment(appointment);
                return (
                  <div
                    key={appointment.id ?? appointment._id}
                    className="rounded-2xl border border-white/10 bg-slate-900/60 p-5"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {getTreatmentName(appointment)}
                        </p>
                        {treatment?.focusDosha ? (
                          <p className="text-xs uppercase tracking-[0.25em] text-emerald-300">
                            Focus · {treatment.focusDosha}
                          </p>
                        ) : null}
                        <p className="text-xs uppercase tracking-[0.3em] text-emerald-300">{window.dayLabel}</p>
                      </div>
                      <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200">
                        {window.timeLabel || "TBD"}
                      </span>
                    </div>
                    <div className="mt-3 grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
                      <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Location / resource</p>
                        <p className="mt-1 text-slate-200">{appointment.resource?.name ?? "Your clinic"}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Notes from practitioner</p>
                        <p className="mt-1 text-slate-200">{appointment.notes?.length ? appointment.notes : "No notes yet"}</p>
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
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Recent therapies</p>
              <p className="mt-1 text-lg font-semibold text-white">Reflect on your care</p>
            </div>
          </div>

          <div className="space-y-3">
            {recentAppointments.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-white/10 bg-slate-900/60 p-5 text-sm text-slate-300">
                Once you complete sessions, they’ll appear here with the day and focus of each therapy.
              </p>
            ) : (
              recentAppointments.map((appointment) => {
                const dateLabel = formatDate(appointment.startTime);
                const timeLabel = formatTime(appointment.startTime);
                const treatment = getTreatmentForAppointment(appointment);

                return (
                  <div
                    key={`recent-${appointment.id ?? appointment._id}`}
                    className="rounded-2xl border border-white/10 bg-slate-900/60 p-5"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {getTreatmentName(appointment)}
                        </p>
                        {treatment?.focusDosha ? (
                          <p className="text-xs uppercase tracking-[0.25em] text-emerald-300">
                            Focus · {treatment.focusDosha}
                          </p>
                        ) : null}
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{dateLabel} · {timeLabel}</p>
                      </div>
                      <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-300">
                        {appointment.status ?? "completed"}
                      </span>
                    </div>
                    {appointment.notes ? (
                      <p className="mt-3 text-sm text-slate-300">{appointment.notes}</p>
                    ) : null}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-dashed border-emerald-400/30 bg-emerald-500/10 p-6 text-sm text-emerald-100">
        <p className="font-semibold uppercase tracking-[0.3em]">Care essentials</p>
        <p className="mt-3 text-emerald-50">
          {resources.length > 0
            ? "Your clinic has already prepared the spaces and equipment needed for your next visits."
            : "Your practitioner will share location details for upcoming sessions soon."}
        </p>
        {treatments.length > 0 ? (
          <p className="mt-2 text-xs uppercase tracking-[0.3em] text-emerald-200">
            {treatments.length} treatment{treatments.length === 1 ? "" : "s"} supporting this cleanse
          </p>
        ) : null}
      </section>
    </div>
  );
};

export default PatientDashboardHome;
