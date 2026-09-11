import { Router } from "express";
import { HistoryController } from "../controllers/HistoryController";
import { auth } from "../middlewares/auth";

const router = Router();

router.get(
    "/summary",
    auth,
    HistoryController.summary
);

router.get(
    "/date/:date",
    auth,
    HistoryController.findByDate
);


router.get(
    "/",
    auth,
    HistoryController.list
);


export default router;