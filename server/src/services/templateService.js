import { listTemplates, createTemplate } from "../repositories/templateRepository.js";
import { AuthorizationError } from "../utils/errorTypes.js";

const buildSearchFilter = ({ search }) => {
    if (!search) {
        return {};
    }

    return {
        name: {
            $regex: search,
            $options: "i",
        },
    };
};

export const listTemplatesForUser = async (currentUser, { search, practitionerId } = {}) => {
    if (!currentUser) {
        throw new AuthorizationError();
    }

    const filters = buildSearchFilter({ search });

    if (currentUser.role === "practitioner") {
        filters.createdBy = currentUser.id;
    } else if (currentUser.role === "admin") {
        if (practitionerId) {
            filters.createdBy = practitionerId;
        }
    } else {
        throw new AuthorizationError();
    }

    return listTemplates(filters);
};

export const createTemplateForUser = async (currentUser, payload) => {
    if (!currentUser || !["admin", "practitioner"].includes(currentUser.role)) {
        throw new AuthorizationError();
    }

    const { practitionerId, ...templateData } = payload;

    const createdBy = currentUser.role === "admin" && practitionerId ? practitionerId : currentUser.id;

    return createTemplate({
        ...templateData,
        createdBy,
    });
};
