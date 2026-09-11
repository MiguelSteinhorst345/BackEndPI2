import { Request, Response } from "express";
import { SubjectModel } from "../models/Subject";

export class SubjectController {

    static async list(
        req: Request,
        res: Response
    ) {
        try {

            const usuarioId =
                (req as any).user.id;

            const materias =
                await SubjectModel.getAll(
                    usuarioId
                );

            return res.status(200).json(
                materias
            );

        } catch (error) {

            console.error(error);

            return res.status(500).json({
                message:
                    "Erro ao buscar matérias."
            });
        }
    }

    static async create(
        req: Request,
        res: Response
    ) {
        try {

            const usuarioId =
                (req as any).user.id;

            const {
                nome,
                descricao,
                cor
            } = req.body;

            if (
                !nome ||
                typeof nome !== "string" ||
                nome.trim() === ""
            ) {
                return res.status(400).json({
                    message:
                        "O nome da matéria é obrigatório."
                });
            }

            const materia =
                await SubjectModel.create({
                    usuario_id: usuarioId,
                    nome: nome.trim(),
                    descricao,
                    cor
                });

            return res.status(201).json({
                message:
                    "Matéria criada com sucesso.",
                materia
            });

        } catch (error) {

            console.error(error);

            return res.status(500).json({
                message:
                    "Erro ao criar matéria."
            });
        }
    }

    static async update(
        req: Request,
        res: Response
    ) {
        try {

            const usuarioId =
                (req as any).user.id;

            const materiaId =
                Number(req.params.id);

            if (isNaN(materiaId)) {
                return res.status(400).json({
                    message:
                        "ID da matéria inválido."
                });
            }

            const {
                nome,
                descricao,
                cor
            } = req.body;

            if (
                !nome ||
                typeof nome !== "string" ||
                nome.trim() === ""
            ) {
                return res.status(400).json({
                    message:
                        "O nome da matéria é obrigatório."
                });
            }

            const result =
                await SubjectModel.update(
                    materiaId,
                    usuarioId,
                    {
                        nome: nome.trim(),
                        descricao,
                        cor
                    }
                );

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message:
                        "Matéria não encontrada."
                });
            }

            return res.status(200).json({
                message:
                    "Matéria atualizada com sucesso."
            });

        } catch (error) {

            console.error(error);

            return res.status(500).json({
                message:
                    "Erro ao atualizar matéria."
            });
        }
    }

    static async delete(
        req: Request,
        res: Response
    ) {
        try {

            const usuarioId =
                (req as any).user.id;

            const materiaId =
                Number(req.params.id);

            if (isNaN(materiaId)) {
                return res.status(400).json({
                    message:
                        "ID da matéria inválido."
                });
            }

            const result =
                await SubjectModel.delete(
                    materiaId,
                    usuarioId
                );

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message:
                        "Matéria não encontrada."
                });
            }

            return res.status(200).json({
                message:
                    "Matéria removida com sucesso."
            });

        } catch (error) {

            console.error(error);

            return res.status(500).json({
                message:
                    "Erro ao remover matéria."
            });
        }
    }
}
