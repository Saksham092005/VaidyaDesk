import { useMemo } from "react";

import { useDashboard } from "./context/index.js";

const DashboardPatients = () => {
    const { patients, upcomingAppointments } = useDashboard();

    const sessionsByPatient = useMemo(() => {
        return upcomingAppointments.reduce((acc, appointment) => {
            const patientId = appointment.patient?._id ?? appointment.patient?.id;
            if (!patientId) return acc;
            acc[patientId] = (acc[patientId] ?? 0) + 1;
            return acc;
        }, {});
    }, [upcomingAppointments]);

    return (
        <div className="space-y-8">
            <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-slate-950/40">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Patient roster</p>
                        <h2 className="mt-1 text-2xl font-semibold text-white">Connected clients</h2>
                        <p className="mt-2 max-w-2xl text-sm text-slate-300">
                            Every patient registered under your practitioner profile. Track how many upcoming sessions each person has
                            and jump into deeper records as we expand the workspace modules.
                        </p>
                    </div>
                    <span className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-200">
                        {patients.length} active
                    </span>
                </div>

                {patients.length === 0 ? (
                    <div className="mt-6 rounded-3xl border border-dashed border-white/10 bg-slate-900/60 p-6 text-sm text-slate-300">
                        No patients are linked to your profile yet. Invite them during onboarding or assign them through the admin
                        console to collaborate here.
                    </div>
                ) : (
                    <div className="mt-6 overflow-hidden rounded-3xl border border-white/10">
                        <table className="min-w-full divide-y divide-white/5">
                            <thead className="bg-slate-900/60 text-left text-xs uppercase tracking-[0.3em] text-slate-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Patient</th>
                                    <th scope="col" className="px-6 py-3">Email</th>
                                    <th scope="col" className="px-6 py-3 text-right">Upcoming sessions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 bg-slate-900/40 text-sm text-slate-200">
                                {patients.map((patient) => {
                                    const patientId = patient._id ?? patient.id;
                                    const sessionCount = sessionsByPatient[patientId] ?? 0;

                                    return (
                                        <tr key={patientId} className="transition hover:bg-white/5">
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-white">{patient.name ?? "Unnamed"}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {patient.email ? (
                                                    <a
                                                        href={`mailto:${patient.email}`}
                                                        className="text-emerald-200 transition hover:text-emerald-100"
                                                    >
                                                        {patient.email}
                                                    </a>
                                                ) : (
                                                    <span className="text-slate-400">—</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200">
                                                    {sessionCount}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    );
};

export default DashboardPatients;
