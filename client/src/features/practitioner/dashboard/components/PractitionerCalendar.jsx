import { useMemo } from "react";

import {
  formatAppointmentWindow,
  formatDate,
  groupAppointmentsByDate,
  sortGroupedAppointments,
} from "../../../../common/utils/date.js";

const STATUS_BADGE_STYLES = {
  scheduled: "border-emerald-300/40 bg-emerald-500/15 text-emerald-200",
  confirmed: "border-cyan-300/40 bg-cyan-500/15 text-cyan-100",
  completed: "border-slate-300/40 bg-slate-200/10 text-slate-100",
  cancelled: "border-rose-400/40 bg-rose-500/15 text-rose-100",
  default: "border-white/10 bg-white/10 text-slate-200",
};

const formatStatus = (status) => {
  if (!status) return "scheduled";
  return String(status).toLowerCase();
};

const getBadgeClassName = (status) => {
  const key = formatStatus(status);
  return STATUS_BADGE_STYLES[key] ?? STATUS_BADGE_STYLES.default;
};

const buildWeekDays = () => {
  const today = new Date();
  const dayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(dayStart);
    date.setDate(dayStart.getDate() + index);
    return date;
  });
};

const PractitionerCalendar = ({ appointments = [], treatments = [] }) => {
  const weekDays = useMemo(buildWeekDays, []);

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
    const grouped = groupAppointmentsByDate(appointments);
    const sorted = sortGroupedAppointments(grouped);

    return sorted.reduce((acc, group) => {
      acc[group.date.toDateString()] = group.items;
      return acc;
    }, {});
  }, [appointments]);

  const legendStatuses = useMemo(() => ["scheduled", "confirmed", "completed", "cancelled"], []);

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-slate-950/40">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Week at a glance</p>
          <h2 className="mt-1 text-2xl font-semibold text-white">Practitioner calendar</h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-300">
            Visualize the next seven days of Panchakarma sessions, color-coded by appointment status. Hover over a card to
            reveal key notes and prep details.
          </p>
        </div>
        <ul className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.3em] text-slate-400">
          {legendStatuses.map((status) => (
            <li
              key={status}
              className={`flex items-center gap-2 rounded-full border px-3 py-1 ${getBadgeClassName(status)}`}
            >
              <span className="h-2 w-2 rounded-full bg-current" />
              <span>{status}</span>
            </li>
          ))}
        </ul>
      </header>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {weekDays.map((date) => {
          const key = date.toDateString();
          const items = appointmentGroups[key] ?? [];

          return (
            <article
              key={key}
              className="flex min-h-[220px] flex-col rounded-2xl border border-white/10 bg-slate-900/60 p-4"
            >
              <header className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-emerald-200">{formatDate(date)}</p>
                  <p className="text-sm text-slate-300">{items.length} session{items.length === 1 ? "" : "s"}</p>
                </div>
              </header>

              <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                {items.length === 0 ? (
                  <p className="rounded-xl border border-dashed border-white/10 bg-slate-900/70 p-3 text-xs text-slate-400">
                    No bookings yet.
                  </p>
                ) : (
                  items.map((appointment) => {
                    const window = formatAppointmentWindow(appointment.startTime, appointment.endTime);
                    const status = formatStatus(appointment.status);

                    const treatment = appointment.treatmentId ? treatmentLookup.get(appointment.treatmentId) : null;
                    const therapyName = treatment?.name ?? appointment.title ?? "Therapy session";

                    return (
                      <div
                        key={appointment.id ?? appointment._id}
                        className={`rounded-xl border px-3 py-3 text-sm shadow-sm transition hover:translate-y-[-2px] hover:shadow-lg ${getBadgeClassName(status)}`}
                      >
                        <p className="text-sm font-semibold text-white">{therapyName}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.3em] text-white/70">{window.timeLabel || "TBD"}</p>
                        {appointment.patient?.name ? (
                          <p className="mt-2 text-xs text-white/70">
                            Patient: <span className="font-medium text-white">{appointment.patient.name}</span>
                          </p>
                        ) : null}
                        {appointment.resource?.name ? (
                          <p className="text-xs text-white/70">
                            Resource: <span className="font-medium text-white">{appointment.resource.name}</span>
                          </p>
                        ) : null}
                        {appointment.notes ? (
                          <p className="mt-2 text-xs text-white/60">{appointment.notes}</p>
                        ) : null}
                      </div>
                    );
                  })
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default PractitionerCalendar;
