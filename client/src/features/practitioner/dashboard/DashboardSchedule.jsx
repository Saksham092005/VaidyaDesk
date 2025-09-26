import { useMemo, useState } from "react";

import {
  formatAppointmentWindow,
  groupAppointmentsByDate,
  sortGroupedAppointments,
} from "../../../common/utils/date.js";
import { useDashboard } from "./context/index.js";
import AppointmentCreateDialog from "./components/AppointmentCreateDialog.jsx";
import PractitionerCalendar from "./components/PractitionerCalendar.jsx";

const WEEKDAY_LABELS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const DashboardSchedule = () => {
  const { upcomingAppointments, resources, patients, treatments = [], refresh } = useDashboard();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

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

  const appointmentGroups = useMemo(() => {
    const grouped = groupAppointmentsByDate(upcomingAppointments);
    return sortGroupedAppointments(grouped);
  }, [upcomingAppointments]);

  return (
    <>
      <div className="space-y-8">
        <PractitionerCalendar appointments={upcomingAppointments} treatments={treatments} />

      <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-slate-950/40">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Practitioner schedule</p>
            <h2 className="mt-1 text-2xl font-semibold text-white">Upcoming sessions</h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              Appointments synced from the scheduling API for the next week. Grouped by day so your therapy flow stays
              organized.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-400/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200 transition hover:border-emerald-300 hover:text-emerald-100"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-300" />
            New appointment
          </button>
        </div>

        <div className="mt-6 space-y-6">
          {appointmentGroups.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/10 bg-slate-900/60 p-6 text-sm text-slate-300">
              No upcoming appointments were found. Once you schedule a session it will appear here in real time.
            </div>
          ) : (
            appointmentGroups.map(({ label, items }) => (
              <div key={label} className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs uppercase tracking-[0.3em] text-emerald-300">{label}</span>
                  <span className="h-px flex-1 bg-gradient-to-r from-emerald-400/30 to-transparent" />
                </div>
                <div className="space-y-3">
                  {items.map((appointment) => {
                    const window = formatAppointmentWindow(appointment.startTime, appointment.endTime);
                    const treatment = appointment.treatmentId ? treatmentLookup.get(appointment.treatmentId) : null;
                    const therapyName = treatment?.name ?? appointment.title ?? "Therapy session";
                    const therapyFocus = treatment?.description ?? appointment.description ?? "Custom";
                    return (
                      <div
                        key={appointment.id ?? appointment._id}
                        className="rounded-2xl border border-white/10 bg-slate-900/60 p-5"
                      >
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-sm font-semibold text-white">{therapyName}</p>
                            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{window.timeLabel}</p>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.3em] text-emerald-200">
                            <span className="rounded-full bg-emerald-500/20 px-3 py-1">{appointment.status ?? "scheduled"}</span>
                            {appointment.resource?.name ? (
                              <span className="rounded-full bg-white/5 px-3 py-1 text-slate-200">
                                {appointment.resource.name}
                              </span>
                            ) : null}
                          </div>
                        </div>
                        <div className="mt-4 grid gap-4 text-sm text-slate-300 sm:grid-cols-3">
                          <div>
                            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Patient</p>
                            <p className="mt-1 text-slate-200">{appointment.patient?.name ?? "—"}</p>
                            {appointment.patient?.email ? (
                              <p className="text-xs text-slate-500">{appointment.patient.email}</p>
                            ) : null}
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Therapy focus</p>
                            <p className="mt-1 text-slate-200">{therapyFocus}</p>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Notes</p>
                            <p className="mt-1 text-slate-200">{appointment.notes?.length ? appointment.notes : "—"}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-500/15 via-emerald-500/5 to-slate-900/60 p-6 shadow-lg shadow-emerald-500/10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-200">Resource lineup</p>
            <h2 className="mt-1 text-2xl font-semibold text-white">Spaces & equipment</h2>
            <p className="mt-2 max-w-2xl text-sm text-emerald-100/80">
              Review which therapy rooms, shirodhara setups, or special equipment are marked active for scheduling.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {resources.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-white/10 bg-slate-900/60 p-5 text-sm text-slate-200">
              No resources configured yet. Add rooms or equipment in the admin panel to reserve them for sessions.
            </p>
          ) : (
            resources.map((resource) => (
              <div key={resource.id ?? resource._id} className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-base font-semibold text-white">{resource.name}</p>
                    {resource.type ? (
                      <p className="text-xs uppercase tracking-[0.25em] text-emerald-300">{resource.type}</p>
                    ) : null}
                  </div>
                  <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-300">
                    {resource.isActive === false ? "Inactive" : "Available"}
                  </span>
                </div>
                {resource.location ? (
                  <p className="mt-3 text-sm text-slate-300">{resource.location}</p>
                ) : null}
                {resource.availability?.length ? (
                  <div className="mt-4 space-y-1 text-xs text-slate-400">
                    <p className="uppercase tracking-[0.3em] text-slate-500">Availability</p>
                    {resource.availability.map((slot, index) => {
                      const dayLabel =
                        typeof slot.dayOfWeek === "number" && WEEKDAY_LABELS[slot.dayOfWeek]
                          ? WEEKDAY_LABELS[slot.dayOfWeek]
                          : "Flexible";
                      const timeWindow = [slot.startTime, slot.endTime].filter(Boolean).join(" – ");
                      const availabilityLabel = timeWindow ? `${dayLabel}: ${timeWindow}` : dayLabel;

                      return (
                        <p key={`${slot.dayOfWeek ?? index}-${slot.startTime ?? "start"}`}>{availabilityLabel}</p>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            ))
          )}
        </div>
      </section>
      </div>

      <AppointmentCreateDialog
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreated={() => refresh?.()}
        patients={patients}
        treatments={treatments}
        resources={resources}
      />
    </>
  );
};

export default DashboardSchedule;
