import { ValidationError } from "../utils/errorTypes.js";

const asTrimmedString = (value, field) => {
    if (typeof value !== "string") {
        throw new ValidationError(`${field} must be a string`);
    }

    const trimmed = value.trim();
    if (!trimmed) {
        throw new ValidationError(`${field} is required`);
    }

    return trimmed;
};

const ensureProvided = (value, field) => {
    if (value === undefined || value === null || value === "") {
        throw new ValidationError(`${field} is required`);
    }
    return value;
};

const optionalStringArray = (value, field) => {
    if (value === undefined) {
        return [];
    }

    if (!Array.isArray(value)) {
        throw new ValidationError(`${field} must be an array of strings`);
    }

    return value.map((entry, index) => {
        if (typeof entry !== "string") {
            throw new ValidationError(`${field}[${index}] must be a string`);
        }
        return entry.trim();
    });
};

const coerceDuration = (value, field) => {
    const numeric = Number(value);
    if (!Number.isFinite(numeric) || numeric < 0) {
        throw new ValidationError(`${field} must be a positive number`);
    }
    return Math.floor(numeric);
};

const optionalSteps = (steps) => {
    if (steps === undefined) {
        return [];
    }

    if (!Array.isArray(steps)) {
        throw new ValidationError("steps must be an array");
    }

    return steps.map((step, index) => {
        if (typeof step !== "object" || step === null) {
            throw new ValidationError(`steps[${index}] must be an object`);
        }

        return {
            name: asTrimmedString(step.name, `steps[${index}].name`),
            description: step.description ? asTrimmedString(step.description, `steps[${index}].description`) : undefined,
            durationMinutes: step.durationMinutes !== undefined ? coerceDuration(step.durationMinutes, `steps[${index}].durationMinutes`) : undefined,
            instructions: optionalStringArray(step.instructions, `steps[${index}].instructions`),
        };
    });
};

const allowedDosha = new Set(["vata", "pitta", "kapha", "tridosha"]);

export const validateTemplatePayload = (body = {}) => {
    const result = {
        name: asTrimmedString(body.name, "name"),
        description: body.description ? asTrimmedString(body.description, "description") : undefined,
        durationMinutes: coerceDuration(ensureProvided(body.durationMinutes, "durationMinutes"), "durationMinutes"),
        focusDosha: "tridosha",
        steps: optionalSteps(body.steps),
    };

    if (body.focusDosha) {
        const normalized = body.focusDosha.toString().toLowerCase();
        if (!allowedDosha.has(normalized)) {
            throw new ValidationError("focusDosha must be one of vata, pitta, kapha, tridosha");
        }
        result.focusDosha = normalized;
    }

    if (body.practitionerId) {
        result.practitionerId = asTrimmedString(body.practitionerId, "practitionerId");
    }

    return result;
};

export const validateTemplateQuery = (query = {}) => {
    const result = {};

    if (query.search) {
        result.search = asTrimmedString(query.search, "search");
    }

    if (query.practitionerId) {
        result.practitionerId = asTrimmedString(query.practitionerId, "practitionerId");
    }

    return result;
};
