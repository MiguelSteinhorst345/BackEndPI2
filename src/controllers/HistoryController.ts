import { Request, Response } from "express";
import { HistoryService } from "../services/HistoryService";

export class HistoryController {

    static async list(
        req: Request,
        res: Response
    ) {

        try {

            const usuarioId = (req as any).user.id;

            const historico =
                await HistoryService.findAll(usuarioId);

            return res.status(200).json(historico);

        } catch (error) {

            console.error(error);

            return res.status(500).json({
                message: "Erro ao buscar histórico."
            });

        }
    }

    static async summary(
        req: Request,
        res: Response
    ) {

        try {

            const usuarioId = (req as any).user.id;

            const resumo =
                await HistoryService.getSummary(usuarioId);

            return res.status(200).json(resumo);

        } catch (error) {

            console.error(error);

            return res.status(500).json({
                message: "Erro ao buscar resumo do desempenho."
            });

        }
    }
    
    static async findByDate(
        req: Request<{ date: string }>,
        res: Response
    ) {

        try {

            const usuarioId = (req as any).user.id;

            const data = req.params.date;

            if (!data) {

                return res.status(400).json({
                    message: "Informe a data."
                });

            }

            const historico =
                await HistoryService.findByDate(
                    usuarioId,
                    data
                );

            return res.status(200).json(historico);

        } catch (error) {

            console.error(error);

            return res.status(500).json({
                message: "Erro ao buscar histórico."
            });

        }
    }

}