import { Router } from "express";
import { DashboardController } from "../controllers/DashboardController";
import { auth } from "../middlewares/auth";


const router = Router();

router.get(
    "/",
    auth,
    DashboardController.getDashboard
);


export default router;