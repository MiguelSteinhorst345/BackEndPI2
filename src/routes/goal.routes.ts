import { Router } from "express";
import { GoalController } from "../controllers/GoalController";
import { auth } from "../middlewares/auth";

const router = Router();

// Criar meta
router.post(
    "/",
    auth,
    GoalController.create
);


// Listar metas
router.get(
    "/",
    auth,
    GoalController.list
);


// Buscar meta
router.get(
    "/:id",
    auth,
    GoalController.findById
);


// Editar meta
router.put(
    "/:id",
    auth,
    GoalController.update
);


// Atualizar progresso
router.patch(
    "/:id/progress",
    auth,
    GoalController.updateProgress
);


// Marcar como concluída
router.patch(
    "/:id/done",
    auth,
    GoalController.markAsDone
);


// Excluir
router.delete(
    "/:id",
    auth,
    GoalController.delete
);


export default router;