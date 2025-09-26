import { Router } from "express";

import * as practitionerController from "../controllers/practitionerController.js";
import { authenticate } from "../middleware/auth.js";
import { allowRoles } from "../middleware/roleGuard.js";

const router = Router();

router.use(authenticate);

router.get(
	"/me/dashboard",
	allowRoles("practitioner", "admin"),
	practitionerController.getOwnDashboard,
);

router.get(
	"/:practitionerId/dashboard",
	allowRoles("practitioner", "admin"),
	practitionerController.getDashboardByPractitionerId,
);

export default router;
