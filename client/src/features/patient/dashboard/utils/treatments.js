export const buildTreatmentLookup = (treatments = []) => {
    const map = new Map();

    treatments.forEach((item) => {
        if (!item) return;
        const id = item.id ?? item._id;
        if (id && !map.has(id)) {
            map.set(id, item);
        }
    });

    return map;
};

export const findTreatmentById = (lookup, id) => {
    if (!id || !lookup) {
        return null;
    }

    if (typeof lookup.get === "function") {
        return lookup.get(id) ?? null;
    }

    return null;
};

export const resolveTreatmentName = (appointment, lookup) => {
    if (!appointment) {
        return "Therapy session";
    }

    const treatment = appointment.treatmentId ? findTreatmentById(lookup, appointment.treatmentId) : null;

    return treatment?.name ?? appointment.title ?? "Therapy session";
};

export const resolveTreatmentDuration = (appointment, lookup, fallbackMinutes) => {
    const treatment = appointment?.treatmentId ? findTreatmentById(lookup, appointment.treatmentId) : null;
    return treatment?.durationMinutes ?? fallbackMinutes ?? null;
};
