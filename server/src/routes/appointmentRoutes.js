import { Router } from "express";

import * as appointmentController from "../controllers/appointmentController.js";
import { authenticate } from "../middleware/auth.js";
import { allowRoles } from "../middleware/roleGuard.js";

const router = Router();

router.use(authenticate);

router.post("/", allowRoles("practitioner", "admin"), appointmentController.createAppointment);
router.get("/", allowRoles("practitioner", "admin"), appointmentController.listAppointments);

export default router;
