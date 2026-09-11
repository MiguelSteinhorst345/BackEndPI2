import { Router } from "express";
import { DashboardController } from "../controllers/DashboardController";
import { auth } from "../middlewares/auth";

const router = Router();
// Dashboard do usuário logado
router.get(
    "/",
    auth,
    DashboardController.get
);

export default router;