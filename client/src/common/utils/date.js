const dateFormatter = new Intl.DateTimeFormat(undefined, {
	weekday: "short",
	month: "short",
	day: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat(undefined, {
	hour: "numeric",
	minute: "2-digit",
});

const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
	weekday: "short",
	month: "short",
	day: "numeric",
	hour: "numeric",
	minute: "2-digit",
});

const toDate = (value) => {
	if (value instanceof Date) return value;
	if (typeof value === "string" || typeof value === "number") {
		const date = new Date(value);
		if (!Number.isNaN(date.getTime())) {
			return date;
		}
	}
	return null;
};

export const formatDate = (value) => {
	const date = toDate(value);
	if (!date) return "";
	return dateFormatter.format(date);
};

export const formatTime = (value) => {
	const date = toDate(value);
	if (!date) return "";
	return timeFormatter.format(date);
};

export const formatDateTime = (value) => {
	const date = toDate(value);
	if (!date) return "";
	return dateTimeFormatter.format(date);
};

export const formatTimeRange = (start, end) => {
	const startDate = toDate(start);
	const endDate = toDate(end);

	if (!startDate || !endDate) return "";

	return `${formatTime(startDate)} – ${formatTime(endDate)}`;
};

export const formatAppointmentWindow = (start, end) => {
	const startDate = toDate(start);
	const endDate = toDate(end);

	if (!startDate || !endDate) {
		return {
			dayLabel: formatDate(startDate || endDate || Date.now()),
			timeLabel: "",
			fullLabel: "",
		};
	}

	const dayLabel = formatDate(startDate);
	const timeLabel = formatTimeRange(startDate, endDate);

	return {
		dayLabel,
		timeLabel,
		fullLabel: `${dayLabel} • ${timeLabel}`,
	};
};

export const groupAppointmentsByDate = (appointments = []) => {
	return appointments.reduce((acc, appointment) => {
		const startDate = toDate(appointment?.startTime);
		if (!startDate) return acc;

		const key = startDate.toDateString();
		if (!acc[key]) {
			acc[key] = {
				date: startDate,
				label: formatDate(startDate),
				items: [],
			};
		}

		acc[key].items.push(appointment);
		return acc;
	}, {});
};

export const sortGroupedAppointments = (groups = {}) => {
	return Object.values(groups).sort((a, b) => a.date.getTime() - b.date.getTime());
};
