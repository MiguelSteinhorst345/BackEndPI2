import { Request, Response } from "express";
import { ExamService } from "../services/ExamService";

export class ExamController {


    static async create(
        req: Request,
        res: Response
    ) {

        try {

            const usuarioId =
                (req as any).user.id;

            const {
                materia_id,
                titulo,
                descricao,
                data_prova
            } = req.body;


            const prova =
                await ExamService.create(
                    usuarioId,
                    Number(materia_id),
                    titulo,
                    descricao,
                    data_prova
                );


            return res.status(201).json({
                message:
                    "Prova cadastrada com sucesso.",
                prova
            });

        } catch (error: any) {

            console.error(error);

            return res.status(400).json({
                message:
                    error.message
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


            const provas =
                await ExamService.findAll(
                    usuarioId
                );


            return res.status(200).json(
                provas
            );

        } catch (error) {

            console.error(error);

            return res.status(500).json({
                message:
                    "Erro ao buscar provas."
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

            const provaId =
                Number(req.params.id);


            if (isNaN(provaId)) {

                return res.status(400).json({
                    message:
                        "ID da prova inválido."
                });
            }


            const provas =
                await ExamService.findById(
                    usuarioId,
                    provaId
                );


            if (provas.length === 0) {

                return res.status(404).json({
                    message:
                        "Prova não encontrada."
                });
            }


            return res.status(200).json(
                provas[0]
            );

        } catch (error) {

            console.error(error);

            return res.status(500).json({
                message:
                    "Erro ao buscar prova."
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

            const provaId =
                Number(req.params.id);

            const {
                materia_id,
                titulo,
                descricao,
                data_prova
            } = req.body;


            if (isNaN(provaId)) {

                return res.status(400).json({
                    message:
                        "ID da prova inválido."
                });
            }


            const resultado =
                await ExamService.update(
                    usuarioId,
                    provaId,
                    Number(materia_id),
                    titulo,
                    descricao,
                    data_prova
                );


            return res.status(200).json(
                resultado
            );

        } catch (error: any) {

            console.error(error);

            return res.status(400).json({
                message:
                    error.message
            });
        }
    }


    static async updateGrade(
        req: Request,
        res: Response
    ) {

        try {

            const usuarioId =
                (req as any).user.id;

            const provaId =
                Number(req.params.id);

            const {
                nota
            } = req.body;


            if (isNaN(provaId)) {

                return res.status(400).json({
                    message:
                        "ID da prova inválido."
                });
            }


            if (nota === undefined) {

                return res.status(400).json({
                    message:
                        "Informe a nota."
                });
            }


            const resultado =
                await ExamService.updateGrade(
                    usuarioId,
                    provaId,
                    Number(nota)
                );


            return res.status(200).json(
                resultado
            );

        } catch (error: any) {

            console.error(error);

            return res.status(400).json({
                message:
                    error.message
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

            const provaId =
                Number(req.params.id);


            if (isNaN(provaId)) {

                return res.status(400).json({
                    message:
                        "ID da prova inválido."
                });
            }


            const resultado =
                await ExamService.markAsDone(
                    usuarioId,
                    provaId
                );


            return res.status(200).json(
                resultado
            );

        } catch (error: any) {

            console.error(error);

            return res.status(400).json({
                message:
                    error.message
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

            const provaId =
                Number(req.params.id);


            if (isNaN(provaId)) {

                return res.status(400).json({
                    message:
                        "ID da prova inválido."
                });
            }


            const resultado =
                await ExamService.delete(
                    usuarioId,
                    provaId
                );


            return res.status(200).json(
                resultado
            );

        } catch (error: any) {

            console.error(error);

            return res.status(404).json({
                message:
                    error.message
            });
        }
    }

}