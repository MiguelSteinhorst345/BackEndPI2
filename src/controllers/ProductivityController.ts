import { Request, Response } from "express";
import { ProductivityService } from "../services/ProductivityService";

export class ProductivityController {
    static async concluirTarefa(
        req: Request,
        res: Response
    ) {
        try {
            const usuarioId = (req as any).user.id;
            const tarefaId = Number(req.params.id);
            if (isNaN(tarefaId)) {
                return res.status(400).json({
                    message: "ID da tarefa inválido."
                });
            }
            const resultado =
                await ProductivityService.concluirTarefa(
                    usuarioId,
                    tarefaId
                );
            return res.json(resultado);
        } catch (error: any) {
            console.error(error);
            return res.status(400).json({
                message: error.message
            });
        }
    }
    static async realizarProva(
        req: Request,
        res: Response
    ) {
        try {
            const usuarioId = (req as any).user.id;
            const provaId = Number(req.params.id);
            const { nota } = req.body;
            if (isNaN(provaId)) {
                return res.status(400).json({
                    message: "ID da prova inválido."
                });
            }
            if (nota === undefined) {
                return res.status(400).json({
                    message: "Informe a nota da prova."
                });
            }
            if (Number(nota) < 0 || Number(nota) > 10) {
                return res.status(400).json({
                    message: "A nota deve estar entre 0 e 10."
                });
            }
            const resultado =
                await ProductivityService.realizarProva(
                    usuarioId,
                    provaId,
                    Number(nota)
                );
            return res.json(resultado);
        } catch (error: any) {
            console.error(error);
            return res.status(400).json({
                message: error.message
            });
        }
    }
}