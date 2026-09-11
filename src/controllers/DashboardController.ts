import { Request, Response } from "express";
import { DashboardService } from "../services/DashboardService";
export class DashboardController {


    static async getDashboard(
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

        } catch (error) {

            console.error(error);

            return res.status(500).json({
                message:
                    "Erro ao carregar dashboard."
            });

        }
    }

}