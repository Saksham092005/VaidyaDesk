import { Router } from "express";
import authRoutes from "./authRoutes.js";
import appointmentRoutes from "./appointmentRoutes.js";
import patientRoutes from "./patientRoutes.js";
import practitionerRoutes from "./practitionerRoutes.js";

const router = Router();

router.get("/health", (_req, res) => {
    res.json({
        status: "ok",
        timestamp: new Date().toISOString(),
    });
});

router.use("/auth", authRoutes);
router.use("/appointments", appointmentRoutes);
router.use("/patients", patientRoutes);
router.use("/practitioners", practitionerRoutes);

export default router;
