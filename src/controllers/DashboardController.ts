import { Request, Response } from "express";
import { DashboardService } from "../services/DashboardService";

export class DashboardController {

    static async get(
        req: Request,
        res: Response
    ) {

        try {

            const usuarioId =
                (req as any).user.id;


            const dashboard =
                await DashboardService.getDashboard(
                    usuarioId
                );


            return res.status(200).json(
                dashboard
            );

        } catch (error: any) {

            console.error(
                "Erro ao carregar dashboard:",
                error
            );


            if (
                error.message ===
                "Usuário não encontrado."
            ) {

                return res.status(404).json({
                    message:
                        error.message
                });

            }


            return res.status(500).json({
                message:
                    "Erro ao carregar dashboard."
            });

        }

    }

}