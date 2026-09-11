import { Router } from "express";
import { TaskController } from "../controllers/TaskController";
import { auth } from "../middlewares/auth";

const router = Router();
router.post(
    "/",
    auth,
    TaskController.create
);
router.get(
    "/",
    auth,
    TaskController.list
);
router.get(
    "/:id",
    auth,
    TaskController.findById
);
router.put(
    "/:id",
    auth,
    TaskController.update
);
router.patch(
    "/:id/done",
    auth,
    TaskController.markAsDone
);
router.delete(
    "/:id",
    auth,
    TaskController.delete
);

export default router;