import { AuthorizationError } from "../utils/errorTypes.js";

export const allowRoles = (...roles) => (req, _res, next) => {
    if (!req.user || (roles.length && !roles.includes(req.user.role))) {
        return next(new AuthorizationError());
    }

    return next();
};
