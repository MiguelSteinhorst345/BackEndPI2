import { Request, Response } from "express";
import db from "../config/database";
import { ProgressService } from "../services/ProgressService";

export class ProgressController {
    static async update(req: Request, res: Response) {
        try {
            const usuarioId = (req as any).user.id;
            const id = Number(req.params.id);
            const [materias]: any = await db.execute(
                `SELECT id
                 FROM materias
                 WHERE id = ?
                 AND usuario_id = ?`,
                [id, usuarioId]
            );
            if (materias.length === 0) {
                return res.status(404).json({
                    message: "Matéria não encontrada."
                });
            }
            const progresso =
                await ProgressService.atualizarMateria(id);
            return res.json({
                message: "Progresso atualizado com sucesso.",
                progresso
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: "Erro ao atualizar progresso."
            });
        }
    }
    static async show(req: Request, res: Response) {
        try {
            const usuarioId = (req as any).user.id;
            const id = Number(req.params.id);
            const [materias]: any = await db.execute(
                `SELECT
                    id,
                    nome,
                    progresso
                 FROM materias
                 WHERE id = ?
                 AND usuario_id = ?`,
                [id, usuarioId]
            );
            if (materias.length === 0) {
                return res.status(404).json({
                    message: "Matéria não encontrada."
                });
            }
            return res.json(materias[0]);
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: "Erro ao buscar progresso."
            });
        }
    }
}