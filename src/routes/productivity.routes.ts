import { Router } from "express";
import { ProductivityController } from "../controllers/ProductivityController";
import { auth } from "../middlewares/auth";

const router = Router();
router.patch(
    "/tasks/:id/complete",
    auth,
    ProductivityController.concluirTarefa
);
router.patch(
    "/exams/:id/finish",
    auth,
    ProductivityController.realizarProva
);
export default router;