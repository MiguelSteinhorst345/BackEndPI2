import { Request, Response } from "express";

import { TaskService } from "../services/TaskService";

export class TaskController {

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
                data_entrega,
                prioridade
            } = req.body;


            const tarefa =
                await TaskService.create(
                    usuarioId,
                    Number(materia_id),
                    titulo,
                    descricao,
                    data_entrega,
                    prioridade
                );


            return res.status(201).json({
                message:
                    "Tarefa cadastrada com sucesso.",
                tarefa
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


            const tarefas =
                await TaskService.findAll(
                    usuarioId
                );


            return res.status(200).json(
                tarefas
            );

        } catch (error) {

            console.error(error);

            return res.status(500).json({
                message:
                    "Erro ao buscar tarefas."
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

            const tarefaId =
                Number(req.params.id);


            if (isNaN(tarefaId)) {

                return res.status(400).json({
                    message:
                        "ID da tarefa inválido."
                });
            }


            const tarefas =
                await TaskService.findById(
                    usuarioId,
                    tarefaId
                );


            if (tarefas.length === 0) {

                return res.status(404).json({
                    message:
                        "Tarefa não encontrada."
                });
            }


            return res.status(200).json(
                tarefas[0]
            );

        } catch (error) {

            console.error(error);

            return res.status(500).json({
                message:
                    "Erro ao buscar tarefa."
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

            const tarefaId =
                Number(req.params.id);

            const {
                materia_id,
                titulo,
                descricao,
                data_entrega,
                prioridade
            } = req.body;


            if (isNaN(tarefaId)) {

                return res.status(400).json({
                    message:
                        "ID da tarefa inválido."
                });
            }


            const resultado =
                await TaskService.update(
                    usuarioId,
                    tarefaId,
                    Number(materia_id),
                    titulo,
                    descricao,
                    data_entrega,
                    prioridade
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

            const tarefaId =
                Number(req.params.id);


            if (isNaN(tarefaId)) {

                return res.status(400).json({
                    message:
                        "ID da tarefa inválido."
                });
            }


            const resultado =
                await TaskService.markAsDone(
                    usuarioId,
                    tarefaId
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

            const tarefaId =
                Number(req.params.id);


            if (isNaN(tarefaId)) {

                return res.status(400).json({
                    message:
                        "ID da tarefa inválido."
                });
            }


            const resultado =
                await TaskService.delete(
                    usuarioId,
                    tarefaId
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