import db from "../config/database";

export interface NotificationData {
    usuario_id: number;
    titulo: string;
    mensagem: string;
}

export class NotificationModel {
    // Criar uma notificação
    static async create(data: NotificationData) {
        const [result]: any = await db.execute(
            `INSERT INTO notificacoes
            (
                usuario_id,
                titulo,
                mensagem
            )
            VALUES (?, ?, ?)`,
            [
                data.usuario_id,
                data.titulo,
                data.mensagem
            ]
        );
        return {
            id: result.insertId,
            usuario_id: data.usuario_id,
            titulo: data.titulo,
            mensagem: data.mensagem
        };
    }
    // Buscar todas as notificações de um usuário
    static async findByUser(
        usuarioId: number
    ) {
        const [rows]: any = await db.execute(
            `SELECT
                id,
                usuario_id,
                titulo,
                mensagem,
                lida,
                data_envio
             FROM notificacoes
             WHERE usuario_id = ?
             ORDER BY data_envio DESC`,
            [usuarioId]
        );
        return rows;
    }
    // Buscar uma notificação específica
    static async findById(
        usuarioId: number,
        notificacaoId: number
    ) {
        const [rows]: any = await db.execute(
            `SELECT
                id,
                usuario_id,
                titulo,
                mensagem,
                lida,
                data_envio
             FROM notificacoes
             WHERE id = ?
             AND usuario_id = ?`,
            [
                notificacaoId,
                usuarioId
            ]
        );
        return rows;
    }
    // Marcar uma notificação como lida
    static async markAsRead(
        usuarioId: number,
        notificacaoId: number
    ) {
        const [result]: any = await db.execute(
            `UPDATE notificacoes
             SET lida = TRUE
             WHERE id = ?
             AND usuario_id = ?`,
            [
                notificacaoId,
                usuarioId
            ]
        );
        return result.affectedRows > 0;
    }
    // Marcar todas as notificações como lidas
    static async markAllAsRead(
        usuarioId: number
    ) {
        const [result]: any = await db.execute(
            `UPDATE notificacoes
             SET lida = TRUE
             WHERE usuario_id = ?
             AND lida = FALSE`,
            [usuarioId]
        );
        return result.affectedRows;
    }
}