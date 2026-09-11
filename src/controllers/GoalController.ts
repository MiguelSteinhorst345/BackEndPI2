import { Request, Response } from "express";

import { GoalService } from "../services/GoalService";

export class GoalController {

    static async create(
        req: Request,
        res: Response
    ) {

        try {

            const usuarioId =
                (req as any).user.id;

            const {
                descricao,
                objetivo,
                data_inicio,
                data_fim
            } = req.body;


            const meta =
                await GoalService.create(
                    usuarioId,
                    descricao,
                    Number(objetivo),
                    data_inicio,
                    data_fim
                );


            return res.status(201).json({
                message:
                    "Meta criada com sucesso.",
                meta
            });

        } catch (error: any) {

            console.error(error);

            return res.status(400).json({
                message: error.message
            });
        }
    }

    static async list(
        req: Request,
        res: Response
    ) {

        try {

            const usuarioId =
                (req as any).user.id;


            const metas =
                await GoalService.findAll(
                    usuarioId
                );


            return res.status(200).json(
                metas
            );

        } catch (error) {

            console.error(error);

            return res.status(500).json({
                message:
                    "Erro ao buscar metas."
            });
        }
    }

    static async findById(
        req: Request,
        res: Response
    ) {

        try {

            const usuarioId =
                (req as any).user.id;

            const metaId =
                Number(req.params.id);


            if (isNaN(metaId)) {
                return res.status(400).json({
                    message:
                        "ID da meta inválido."
                });
            }


            const metas =
                await GoalService.findById(
                    usuarioId,
                    metaId
                );


            if (metas.length === 0) {
                return res.status(404).json({
                    message:
                        "Meta não encontrada."
                });
            }


            return res.status(200).json(
                metas[0]
            );

        } catch (error) {

            console.error(error);

            return res.status(500).json({
                message:
                    "Erro ao buscar meta."
            });
        }
    }


    // PUT /goals/:id
    static async update(
        req: Request,
        res: Response
    ) {

        try {

            const usuarioId =
                (req as any).user.id;

            const metaId =
                Number(req.params.id);

            const {
                descricao,
                objetivo,
                data_inicio,
                data_fim
            } = req.body;


            if (isNaN(metaId)) {
                return res.status(400).json({
                    message:
                        "ID da meta inválido."
                });
            }


            const resultado =
                await GoalService.update(
                    usuarioId,
                    metaId,
                    descricao,
                    Number(objetivo),
                    data_inicio,
                    data_fim
                );


            return res.status(200).json(
                resultado
            );

        } catch (error: any) {

            console.error(error);

            return res.status(400).json({
                message: error.message
            });
        }
    }

    static async updateProgress(
        req: Request,
        res: Response
    ) {

        try {

            const usuarioId =
                (req as any).user.id;

            const metaId =
                Number(req.params.id);

            const {
                progresso
            } = req.body;


            if (isNaN(metaId)) {
                return res.status(400).json({
                    message:
                        "ID da meta inválido."
                });
            }


            if (progresso === undefined) {
                return res.status(400).json({
                    message:
                        "Informe o progresso."
                });
            }


            const resultado =
                await GoalService.updateProgress(
                    usuarioId,
                    metaId,
                    Number(progresso)
                );


            return res.status(200).json(
                resultado
            );

        } catch (error: any) {

            console.error(error);

            return res.status(400).json({
                message: error.message
            });
        }
    }

    static async markAsDone(
        req: Request,
        res: Response
    ) {

        try {

            const usuarioId =
                (req as any).user.id;

            const metaId =
                Number(req.params.id);


            if (isNaN(metaId)) {
                return res.status(400).json({
                    message:
                        "ID da meta inválido."
                });
            }


            const resultado =
                await GoalService.markAsDone(
                    usuarioId,
                    metaId
                );


            return res.status(200).json(
                resultado
            );

        } catch (error: any) {

            console.error(error);

            return res.status(400).json({
                message: error.message
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

            const metaId =
                Number(req.params.id);


            if (isNaN(metaId)) {
                return res.status(400).json({
                    message:
                        "ID da meta inválido."
                });
            }


            const resultado =
                await GoalService.delete(
                    usuarioId,
                    metaId
                );


            return res.status(200).json(
                resultado
            );

        } catch (error: any) {

            console.error(error);

            return res.status(404).json({
                message: error.message
            });
        }
    }
}