import { Request, Response } from "express";
import { RankingService } from "../services/RankingService";

export class RankingController {

    static async list(
        req: Request,
        res: Response
    ) {

        try {

            const ranking =
                await RankingService.getRanking();

            return res.status(200).json(
                ranking
            );

        } catch (error) {

            console.error(error);

            return res.status(500).json({
                message: "Erro ao buscar ranking."
            });

        }
    }

    static async myPosition(
        req: Request,
        res: Response
    ) {

        try {

            const usuarioId =
                (req as any).user.id;

            const resultado =
                await RankingService.getUserPosition(
                    usuarioId
                );

            return res.status(200).json(
                resultado
            );

        } catch (error) {

            console.error(error);

            return res.status(500).json({
                message:
                    "Erro ao buscar posição no ranking."
            });

        }
    }

}