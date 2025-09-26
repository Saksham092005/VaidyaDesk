import { useMemo, useState } from "react";

import {
	formatAppointmentWindow,
	groupAppointmentsByDate,
	sortGroupedAppointments,
} from "../../../common/utils/date.js";
import { usePatientDashboard } from "../dashboard/context/index.js";
import { buildTreatmentLookup, resolveTreatmentName } from "../dashboard/utils/treatments.js";
import PatientBookingDialog from "./PatientBookingDialog.jsx";

const PatientSchedulePage = () => {
	const {
		upcomingAppointments,
		recentAppointments,
		practitioner,
		practitioners,
		resources,
		treatments,
		refresh,
	} = usePatientDashboard();

	const therapyCatalog = (treatments && treatments.length > 0) ? treatments : [];

	const treatmentLookup = useMemo(() => buildTreatmentLookup(therapyCatalog), [therapyCatalog]);

	const totalTreatments = therapyCatalog.length;
	const [isBookingOpen, setIsBookingOpen] = useState(false);

	const groupedUpcoming = useMemo(() => {
		const grouped = groupAppointmentsByDate(upcomingAppointments);
		return sortGroupedAppointments(grouped);
	}, [upcomingAppointments]);

	const groupedRecent = useMemo(() => {
		const grouped = groupAppointmentsByDate(recentAppointments);
		return sortGroupedAppointments(grouped).reverse();
	}, [recentAppointments]);

	return (
		<>
			<div className="space-y-10">
				<section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-slate-950/40">
					<header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						<div>
							<p className="text-xs uppercase tracking-[0.3em] text-slate-400">Schedule & bookings</p>
							<h1 className="mt-1 text-2xl font-semibold text-white">Plan your upcoming therapies</h1>
							<p className="mt-2 max-w-2xl text-sm text-slate-300">
								Review the sessions confirmed by your practitioner, request a new time, and keep track of the spaces prepared for you.
							</p>
							{totalTreatments > 0 ? (
								<p className="mt-3 text-xs uppercase tracking-[0.3em] text-emerald-200">
									{totalTreatments} treatment{totalTreatments === 1 ? "" : "s"} ready to book
								</p>
							) : null}
						</div>
						<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
							{practitioner ? (
								<div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-xs uppercase tracking-[0.25em] text-emerald-200">
									Guided by {practitioner.name}
									{practitioner.email ? <span className="block text-slate-400">{practitioner.email}</span> : null}
								</div>
							) : (
								<div className="rounded-2xl border border-dashed border-white/10 bg-slate-900/60 p-4 text-xs uppercase tracking-[0.25em] text-amber-200">
									No practitioner assigned yet
									<span className="block text-amber-100/70">
										Choose a practitioner when requesting your next session.
									</span>
								</div>
							)}
							<button
								type="button"
								onClick={() => setIsBookingOpen(true)}
								className="inline-flex items-center gap-2 rounded-full border border-emerald-400/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200 transition hover:border-emerald-300 hover:text-emerald-100"
							>
								<span className="h-2 w-2 rounded-full bg-emerald-300" />
								Request session
							</button>
						</div>
						<p className="text-xs text-slate-400 sm:text-right">
							Need to refresh your personal details? Head to the Profile tab.
						</p>
					</header>

				<div className="mt-6 space-y-6">
					{groupedUpcoming.length === 0 ? (
						<div className="rounded-2xl border border-dashed border-white/10 bg-slate-900/60 p-6 text-sm text-slate-300">
							No upcoming sessions yet. You’ll see future appointments as soon as your practitioner schedules them.
						</div>
					) : (
						groupedUpcoming.map(({ label, items }) => (
							<div key={`upcoming-${label}`} className="space-y-4">
								<div className="flex items-center gap-3">
									<span className="text-xs uppercase tracking-[0.3em] text-emerald-300">{label}</span>
									<span className="h-px flex-1 bg-gradient-to-r from-emerald-400/30 to-transparent" />
								</div>
								<div className="space-y-3">
									{items.map((appointment) => {
										const window = formatAppointmentWindow(appointment.startTime, appointment.endTime);
										const matchedTreatment = appointment.treatmentId ? treatmentLookup.get(appointment.treatmentId) : null;

										return (
											<article
												key={appointment.id ?? appointment._id}
												className="rounded-2xl border border-white/10 bg-slate-900/60 p-5"
											>
												<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
													<div>
														<p className="text-base font-semibold text-white">
															{resolveTreatmentName(appointment, treatmentLookup)}
														</p>
														{matchedTreatment?.focusDosha ? (
															<p className="text-xs uppercase tracking-[0.25em] text-emerald-300">
																Focus · {matchedTreatment.focusDosha}
															</p>
														) : null}
														<p className="text-xs uppercase tracking-[0.3em] text-slate-400">{window.timeLabel || "TBD"}</p>
													</div>
													<span className="inline-flex items-center rounded-full bg-emerald-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200">
														{appointment.status ?? "scheduled"}
													</span>
												</div>

												<div className="mt-4 grid gap-4 text-sm text-slate-300 sm:grid-cols-2">
													<div>
														<p className="text-xs uppercase tracking-[0.25em] text-slate-500">Location</p>
														<p className="mt-1 text-slate-200">{appointment.resource?.name ?? "Clinic"}</p>
													</div>
													<div>
														<p className="text-xs uppercase tracking-[0.25em] text-slate-500">Preparation notes</p>
														<p className="mt-1 text-slate-200">{appointment.notes?.length ? appointment.notes : "None yet"}</p>
													</div>
												</div>
											</article>
										);
									})}
								</div>
							</div>
						))
					)}
				</div>
			</section>

			<section className="rounded-3xl border border-white/10 bg-emerald-500/10 p-6 shadow-lg shadow-emerald-500/20">
				<header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<p className="text-xs uppercase tracking-[0.3em] text-emerald-200">Recovery reflections</p>
						<h2 className="mt-1 text-2xl font-semibold text-white">Recent therapies</h2>
						<p className="mt-2 max-w-2xl text-sm text-emerald-50/80">
							Keep track of what you’ve completed. Use these summaries to follow practitioner guidance and note how your
							body responded after each cleanse.
						</p>
					</div>
				</header>

				<div className="mt-6 space-y-6">
					{groupedRecent.length === 0 ? (
						<p className="rounded-2xl border border-dashed border-white/10 bg-slate-900/40 p-6 text-sm text-emerald-100/80">
							Once you finish therapy sessions, they’ll show up here with the day, time, and any notes shared with you.
						</p>
					) : (
						groupedRecent.map(({ label, items }) => (
							<div key={`recent-${label}`} className="space-y-3">
								<div className="flex items-center gap-3">
									<span className="text-xs uppercase tracking-[0.3em] text-emerald-200">{label}</span>
									<span className="h-px flex-1 bg-gradient-to-r from-emerald-300/30 to-transparent" />
								</div>
								<div className="space-y-3">
									{items.map((appointment) => {
										const window = formatAppointmentWindow(appointment.startTime, appointment.endTime);
										const matchedTreatment = appointment.treatmentId ? treatmentLookup.get(appointment.treatmentId) : null;
										return (
											<article
												key={`recent-${appointment.id ?? appointment._id}`}
												className="rounded-2xl border border-white/10 bg-slate-900/60 p-5"
											>
												<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
													<div>
														<p className="text-base font-semibold text-white">
															{resolveTreatmentName(appointment, treatmentLookup)}
														</p>
														{matchedTreatment?.focusDosha ? (
															<p className="text-xs uppercase tracking-[0.25em] text-emerald-200">
																Focus · {matchedTreatment.focusDosha}
															</p>
														) : null}
														<p className="text-xs uppercase tracking-[0.3em] text-emerald-200">{window.fullLabel}</p>
													</div>
													<span className="inline-flex items-center rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-200">
														{appointment.status ?? "completed"}
													</span>
												</div>
												{appointment.notes ? (
													<p className="mt-4 text-sm text-slate-200">{appointment.notes}</p>
												) : null}
											</article>
										);
									})}
								</div>
							</div>
						))
					)}
				</div>
			</section>

			<section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-slate-950/40">
				<header>
					<p className="text-xs uppercase tracking-[0.3em] text-slate-400">Preparation checklist</p>
					<h2 className="mt-1 text-2xl font-semibold text-white">Spaces & support</h2>
					<p className="mt-2 max-w-2xl text-sm text-slate-300">
						Your clinic keeps these rooms and resources ready for you. Double-check any special instructions shared ahead
						of time.
					</p>
				</header>

				<div className="mt-6 grid gap-4 md:grid-cols-2">
					{resources.length === 0 ? (
						<p className="rounded-2xl border border-dashed border-white/10 bg-slate-900/60 p-5 text-sm text-slate-300">
							Resources will appear once your practitioner assigns rooms, equipment, or supporting staff for your
							therapies.
						</p>
					) : (
						resources.map((resource) => (
							<article key={resource.id ?? resource._id} className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
								<div className="flex items-center justify-between gap-3">
									<div>
										<p className="text-base font-semibold text-white">{resource.name}</p>
										{resource.type ? (
											<p className="text-xs uppercase tracking-[0.25em] text-emerald-300">{resource.type}</p>
										) : null}
									</div>
									<span className="rounded-full bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-300">
										{resource.isActive === false ? "Inactive" : "Ready"}
									</span>
								</div>
								{resource.location ? <p className="mt-3 text-sm text-slate-300">{resource.location}</p> : null}
								{resource.notes ? <p className="mt-2 text-xs text-slate-500">{resource.notes}</p> : null}
							</article>
						))
					)}
				</div>
			</section>
			</div>

			<PatientBookingDialog
				open={isBookingOpen}
				onClose={() => setIsBookingOpen(false)}
				treatments={therapyCatalog}
				resources={resources}
				practitioner={practitioner}
				practitioners={practitioners}
				onCreated={() => refresh?.()}
			/>
		</>
	);
};

export default PatientSchedulePage;
