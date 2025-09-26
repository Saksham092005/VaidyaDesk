import { Router } from "express";

import * as patientController from "../controllers/patientController.js";
import { authenticate } from "../middleware/auth.js";
import { allowRoles } from "../middleware/roleGuard.js";

const router = Router();

router.use(authenticate);

router.get(
	"/me/dashboard",
	allowRoles("patient", "admin"),
	patientController.getOwnDashboard,
);

router.get(
	"/me/appointments",
	allowRoles("patient", "admin"),
	patientController.listOwnAppointments,
);

router.post(
	"/me/appointments",
	allowRoles("patient", "admin"),
	patientController.createOwnAppointmentRequest,
);

router.get(
	"/:patientId/dashboard",
	allowRoles("practitioner", "admin"),
	patientController.getDashboardByPatientId,
);

router.get(
	"/:patientId/appointments",
	allowRoles("practitioner", "admin"),
	patientController.listAppointmentsByPatientId,
);

export default router;
