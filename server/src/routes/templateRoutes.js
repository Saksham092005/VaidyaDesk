import { Router } from "express";

import * as templateController from "../controllers/templateController.js";
import { authenticate } from "../middleware/auth.js";
import { allowRoles } from "../middleware/roleGuard.js";

const router = Router();

router.use(authenticate);

router.get("/", allowRoles("practitioner", "admin"), templateController.listTemplates);
router.post("/", allowRoles("practitioner", "admin"), templateController.createTemplate);

export default router;
