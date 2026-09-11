import { Request, Response } from "express";
import { ProductivityService } from "../services/ProductivityService";

export class ProductivityController {

    static async concluirTarefa(
        req: Request,
        res: Response
    ) {

        try {

            const usuarioId =
                (req as any).user.id;

            const tarefaId =
                Number(req.params.id);


            if (
                !Number.isInteger(tarefaId) ||
                tarefaId <= 0
            ) {

                return res.status(400).json({
                    message:
                        "ID da tarefa inválido."
                });
            }


            const resultado =
                await ProductivityService.concluirTarefa(
                    usuarioId,
                    tarefaId
                );


            return res.status(200).json(
                resultado
            );

        } catch (error: any) {

            console.error(
                "Erro ao concluir tarefa:",
                error
            );

            return res.status(400).json({
                message:
                    error.message ||
                    "Erro ao concluir tarefa."
            });
        }
    }

    static async realizarProva(
        req: Request,
        res: Response
    ) {

        try {

            const usuarioId =
                (req as any).user.id;

            const provaId =
                Number(req.params.id);

            const nota =
                Number(req.body.nota);


            if (
                !Number.isInteger(provaId) ||
                provaId <= 0
            ) {

                return res.status(400).json({
                    message:
                        "ID da prova inválido."
                });
            }


            if (
                !Number.isFinite(nota)
            ) {

                return res.status(400).json({
                    message:
                        "A nota é obrigatória e deve ser um número."
                });
            }


            if (
                nota < 0 ||
                nota > 10
            ) {

                return res.status(400).json({
                    message:
                        "A nota deve estar entre 0 e 10."
                });
            }


            const resultado =
                await ProductivityService.realizarProva(
                    usuarioId,
                    provaId,
                    nota
                );


            return res.status(200).json(
                resultado
            );

        } catch (error: any) {

            console.error(
                "Erro ao realizar prova:",
                error
            );

            return res.status(400).json({
                message:
                    error.message ||
                    "Erro ao registrar prova."
            });
        }
    }
}
