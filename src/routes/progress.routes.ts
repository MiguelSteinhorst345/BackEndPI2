import { Router } from "express";
import { ProgressController } from "../controllers/ProgressController";
import { auth } from "../middlewares/auth";

const router = Router();
router.patch(
    "/subjects/:id",
    auth,
    ProgressController.update
);
router.get(
    "/subjects/:id",
    auth,
    ProgressController.show
);

export default router;