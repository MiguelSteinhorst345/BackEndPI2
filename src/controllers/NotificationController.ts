import { Request, Response } from "express";
import { NotificationModel } from "../models/Notification";

export class NotificationController {
    static async list(
        req: Request,
        res: Response
    ) {
        try {
            const usuarioId = (req as any).user.id;
            const notificacoes =
                await NotificationModel.findByUser(
                    usuarioId
                );
            return res.status(200).json(
                notificacoes
            );
        } catch (error) {
            console.error(
                "Erro ao buscar notificações:",
                error
            );
            return res.status(500).json({
                message:
                    "Erro ao buscar notificações."
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
            const notificacaoId =
                Number(req.params.id);
            if (isNaN(notificacaoId)) {
                return res.status(400).json({
                    message:
                        "ID da notificação inválido."
                });
            }
            const notificacoes =
                await NotificationModel.findById(
                    usuarioId,
                    notificacaoId
                );
            if (notificacoes.length === 0) {
                return res.status(404).json({
                    message:
                        "Notificação não encontrada."
                });
            }
            return res.status(200).json(
                notificacoes[0]
            );
        } catch (error) {
            console.error(
                "Erro ao buscar notificação:",
                error
            );
            return res.status(500).json({
                message:
                    "Erro ao buscar notificação."
            });
        }
    }
    static async markAsRead(
        req: Request,
        res: Response
    ) {
        try {
            const usuarioId =
                (req as any).user.id;
            const notificacaoId =
                Number(req.params.id);
            if (isNaN(notificacaoId)) {
                return res.status(400).json({
                    message:
                        "ID da notificação inválido."
                });
            }
            const atualizada =
                await NotificationModel.markAsRead(
                    usuarioId,
                    notificacaoId
                );
            if (!atualizada) {
                return res.status(404).json({
                    message:
                        "Notificação não encontrada."
                });
            }
            return res.status(200).json({
                message:
                    "Notificação marcada como lida."
            });
        } catch (error) {
            console.error(
                "Erro ao marcar notificação:",
                error
            );
            return res.status(500).json({
                message:
                    "Erro ao marcar notificação como lida."
            });
        }
    }
    static async markAllAsRead(
        req: Request,
        res: Response
    ) {
        try {
            const usuarioId =
                (req as any).user.id;
            const quantidade =
                await NotificationModel.markAllAsRead(
                    usuarioId
                );
            return res.status(200).json({
                message:
                    "Todas as notificações foram marcadas como lidas.",
                quantidade
            });
        } catch (error) {
            console.error(
                "Erro ao marcar notificações:",
                error
            );
            return res.status(500).json({
                message:
                    "Erro ao marcar notificações como lidas."
            });
        }
    }
}