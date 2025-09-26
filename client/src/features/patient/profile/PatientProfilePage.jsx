import { useMemo } from "react";

import {
    formatAppointmentWindow,
    formatDate,
    formatTime,
} from "../../../common/utils/date.js";
import { usePatientDashboard } from "../dashboard/context/index.js";
import {
    buildTreatmentLookup,
    findTreatmentById,
    resolveTreatmentName as resolveTreatmentNameWithLookup,
} from "../dashboard/utils/treatments.js";

const InfoRow = ({ label, value, helper }) => (
    <div className="space-y-1 rounded-2xl border border-white/10 bg-slate-900/60 p-4">
        <p className="text-xs uppercase tracking-[0.25em] text-slate-500">{label}</p>
        <p className="text-sm font-medium text-white">{value ?? "—"}</p>
        {helper ? <p className="text-xs text-slate-400">{helper}</p> : null}
    </div>
);

const PatientProfilePage = () => {
    const {
        patient,
        practitioner,
        stats,
        upcomingAppointments,
        recentAppointments,
        treatments,
        resources,
    } = usePatientDashboard();

    const treatmentLookup = useMemo(() => buildTreatmentLookup(treatments), [treatments]);

    const getTreatmentForAppointment = (appointment) =>
        appointment?.treatmentId ? findTreatmentById(treatmentLookup, appointment.treatmentId) : null;

    const resolveName = (appointment) => resolveTreatmentNameWithLookup(appointment, treatmentLookup);

    const nextAppointment = upcomingAppointments?.[0] ?? null;
    const mostRecent = recentAppointments?.[0] ?? null;

    const nextWindow = nextAppointment
        ? formatAppointmentWindow(nextAppointment.startTime, nextAppointment.endTime)
        : null;
    const nextTreatment = getTreatmentForAppointment(nextAppointment);
    const mostRecentTreatment = getTreatmentForAppointment(mostRecent);

    const profileSummary = [
        {
            label: "Patient name",
            value: patient?.name ?? "Awaiting profile",
            helper: patient?.email,
        },
        {
            label: "Assigned practitioner",
            value: practitioner?.name ?? "Not assigned yet",
            helper: practitioner?.email,
        },
        {
            label: "Active cleanse sessions",
            value: stats?.upcomingCount ?? upcomingAppointments.length,
            helper: "Booked for the week ahead",
        },
        {
            label: "Treatments assigned",
            value: treatments.length,
            helper: "Protocols curated for you",
        },
        {
            label: "Total therapies completed",
            value: stats?.totalAppointments ?? recentAppointments.length,
            helper: "Across your Panchakarma journey",
        },
    ];

    return (
        <div className="space-y-8">
            <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-500/20 via-emerald-500/10 to-slate-900/60 p-8 shadow-xl">
                <p className="text-xs uppercase tracking-[0.3em] text-emerald-200">Profile overview</p>
                <h1 className="mt-3 text-3xl font-semibold text-white">
                    {patient?.name ? `${patient.name}, stay rooted in your cleanse.` : "Your Panchakarma profile"}
                </h1>
                <p className="mt-4 max-w-2xl text-sm text-slate-200">
                    Review your personal details, the practitioner guiding you, and the spaces prepared for upcoming therapies. This
                    information syncs automatically whenever your care team updates the schedule.
                </p>
            </section>

            <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {profileSummary.map((item) => (
                    <InfoRow key={item.label} {...item} />
                ))}
            </section>

            <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="space-y-5 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-slate-950/40">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Next session</p>
                            <h2 className="mt-1 text-xl font-semibold text-white">Stay ready for therapy</h2>
                        </div>
                        {nextAppointment ? (
                            <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200">
                                {nextAppointment.status ?? "scheduled"}
                            </span>
                        ) : null}
                    </div>

                    {nextAppointment ? (
                        <div className="space-y-4 rounded-2xl border border-white/10 bg-slate-900/60 p-5">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-white">
                                        {resolveName(nextAppointment)}
                                    </p>
                                    {nextTreatment?.focusDosha ? (
                                        <p className="text-xs uppercase tracking-[0.25em] text-emerald-300">
                                            Focus · {nextTreatment.focusDosha}
                                        </p>
                                    ) : null}
                                    <p className="text-xs uppercase tracking-[0.3em] text-emerald-300">
                                        {nextWindow?.dayLabel}
                                    </p>
                                </div>
                                <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-200">
                                    {nextWindow?.timeLabel ?? "TBD"}
                                </span>
                            </div>
                            <div className="grid gap-4 text-sm text-slate-300 sm:grid-cols-2">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Location</p>
                                    <p className="mt-1 text-slate-200">{nextAppointment.resource?.name ?? "Clinic"}</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Preparation</p>
                                    <p className="mt-1 text-slate-200">{nextAppointment.notes?.length ? nextAppointment.notes : "Follow practitioner guidance"}</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className="rounded-2xl border border-dashed border-white/10 bg-slate-900/60 p-5 text-sm text-slate-300">
                            Your practitioner will schedule the next therapy soon. You’ll see the time and prep notes right here when it’s
                            ready.
                        </p>
                    )}
                </div>

                <div className="space-y-5 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-slate-950/40">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Recent progress</p>
                    <h2 className="text-xl font-semibold text-white">Latest therapy reflection</h2>
                    {mostRecent ? (
                        <div className="space-y-4 rounded-2xl border border-white/10 bg-slate-900/60 p-5">
                            <p className="text-sm font-semibold text-white">
                                {resolveName(mostRecent)}
                            </p>
                            {mostRecentTreatment?.focusDosha ? (
                                <p className="text-xs uppercase tracking-[0.25em] text-emerald-300">
                                    Focus · {mostRecentTreatment.focusDosha}
                                </p>
                            ) : null}
                            <p className="text-xs uppercase tracking-[0.3em] text-emerald-200">
                                {formatDate(mostRecent.startTime)} · {formatTime(mostRecent.startTime)}
                            </p>
                            <p className="text-sm text-slate-300">
                                {mostRecent.notes?.length
                                    ? mostRecent.notes
                                    : "Capture how you felt post-therapy in your feedback journal to share insights with your practitioner."}
                            </p>
                        </div>
                    ) : (
                        <p className="rounded-2xl border border-dashed border-white/10 bg-slate-900/60 p-5 text-sm text-slate-300">
                            Once you complete a therapy session, a quick recap will appear here so you can revisit practitioner guidance.
                        </p>
                    )}
                </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-slate-950/40">
                    <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Treatment catalogue</p>
                        <h2 className="mt-1 text-xl font-semibold text-white">Protocols guiding your cleanse</h2>
                    </div>
                    <div className="space-y-3">
                        {treatments.length === 0 ? (
                            <p className="rounded-2xl border border-dashed border-white/10 bg-slate-900/60 p-5 text-sm text-slate-300">
                                Your practitioner will assign treatment protocols as they map your Panchakarma plan.
                            </p>
                        ) : (
                            treatments.map((treatment) => (
                                <div
                                    key={treatment.id ?? treatment._id}
                                    className="rounded-2xl border border-white/10 bg-slate-900/60 p-5"
                                >
                                    <p className="text-sm font-semibold text-white">{treatment.name}</p>
                                    {treatment.focusDosha ? (
                                        <p className="text-xs uppercase tracking-[0.25em] text-emerald-300">Focus · {treatment.focusDosha}</p>
                                    ) : null}
                                    {treatment.durationMinutes ? (
                                        <p className="mt-2 text-xs text-slate-400">Estimated duration: {treatment.durationMinutes} minutes</p>
                                    ) : null}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-slate-950/40">
                    <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Spaces & support</p>
                        <h2 className="mt-1 text-xl font-semibold text-white">Resources prepared for you</h2>
                    </div>
                    <div className="space-y-3">
                        {resources.length === 0 ? (
                            <p className="rounded-2xl border border-dashed border-white/10 bg-slate-900/60 p-5 text-sm text-slate-300">
                                Rooms, equipment, and support staff will appear here once confirmed by your clinic.
                            </p>
                        ) : (
                            resources.map((resource) => (
                                <div
                                    key={resource.id ?? resource._id}
                                    className="rounded-2xl border border-white/10 bg-slate-900/60 p-5"
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <div>
                                            <p className="text-sm font-semibold text-white">{resource.name}</p>
                                            {resource.type ? (
                                                <p className="text-xs uppercase tracking-[0.25em] text-emerald-300">{resource.type}</p>
                                            ) : null}
                                        </div>
                                        <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-200">
                                            {resource.isActive === false ? "Inactive" : "Ready"}
                                        </span>
                                    </div>
                                    {resource.location ? <p className="mt-2 text-xs text-slate-400">Location: {resource.location}</p> : null}
                                    {resource.notes ? <p className="mt-2 text-xs text-slate-500">{resource.notes}</p> : null}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PatientProfilePage;
