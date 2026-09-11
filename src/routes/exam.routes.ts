import { Router } from "express";
import { ExamController } from "../controllers/ExamController";
import { auth } from "../middlewares/auth";

const router = Router();

// Criar prova
router.post(
    "/",
    auth,
    ExamController.create
);

// Listar provas
router.get(
    "/",
    auth,
    ExamController.list
);


// Buscar prova
router.get(
    "/:id",
    auth,
    ExamController.findById
);


// Editar prova
router.put(
    "/:id",
    auth,
    ExamController.update
);


// Registrar nota
router.patch(
    "/:id/grade",
    auth,
    ExamController.updateGrade
);


// Marcar como realizada
router.patch(
    "/:id/done",
    auth,
    ExamController.markAsDone
);


// Excluir prova
router.delete(
    "/:id",
    auth,
    ExamController.delete
);


export default router;