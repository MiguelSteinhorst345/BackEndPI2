import { Router } from "express";
import { SubjectController } from "../controllers/SubjectController";
import { auth } from "../middlewares/auth";

const router=Router();
router.get("/",auth,SubjectController.list);
router.post("/",auth,SubjectController.create);
router.put("/:id",auth,SubjectController.update);
router.delete("/:id",auth,SubjectController.delete);

export default router;