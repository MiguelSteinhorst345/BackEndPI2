import { Router } from "express";
import { NotificationController } from "../controllers/NotificationController";
import { auth } from "../middlewares/auth";

const router = Router();
router.get(
    "/",
    auth,
    NotificationController.list
);
router.patch(
    "/read-all",
    auth,
    NotificationController.markAllAsRead
);
router.patch(
    "/:id/read",
    auth,
    NotificationController.markAsRead
);
router.get(
    "/:id",
    auth,
    NotificationController.findById
);
export default router;