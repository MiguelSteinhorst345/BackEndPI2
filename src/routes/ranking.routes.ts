import { Router } from "express";
import { RankingController } from "../controllers/RankingController";
import { auth } from "../middlewares/auth";

const router = Router();
router.get(
    "/",
    auth,
    RankingController.list
);
router.get(
    "/me",
    auth,
    RankingController.myPosition
);

export default router;