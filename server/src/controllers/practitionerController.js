import { StatusCodes } from "http-status-codes";

import { getPractitionerDashboard } from "../services/schedulingService.js";
import { extractPractitionerIdParam } from "../validations/schedulingValidation.js";

export const getOwnDashboard = async (req, res, next) => {
    try {
        const dashboard = await getPractitionerDashboard(req.user);
        res.status(StatusCodes.OK).json({
            success: true,
            data: dashboard,
        });
    } catch (error) {
        next(error);
    }
};

export const getDashboardByPractitionerId = async (req, res, next) => {
    try {
        const practitionerId = extractPractitionerIdParam(req.params);
        const dashboard = await getPractitionerDashboard(req.user, practitionerId);
        res.status(StatusCodes.OK).json({
            success: true,
            data: dashboard,
        });
    } catch (error) {
        next(error);
    }
};
