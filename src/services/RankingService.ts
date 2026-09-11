import db from "../config/database";

export class RankingService {

    static async getRanking() {

        const [rows]: any = await db.execute(
            `SELECT
                ranking_produtividade.id,
                ranking_produtividade.usuario_id,
                usuarios.nome,
                ranking_produtividade.pontuacao,
                ranking_produtividade.ultima_atualizacao
             FROM ranking_produtividade
             INNER JOIN usuarios
                ON usuarios.id = ranking_produtividade.usuario_id
             ORDER BY ranking_produtividade.pontuacao DESC`
        );

        return rows;
    }

    static async getUserPosition(
        usuarioId: number
    ) {

        const [rows]: any = await db.execute(
            `SELECT
                usuario_id,
                pontuacao
             FROM ranking_produtividade
             ORDER BY pontuacao DESC`
        );

        const posicao =
            rows.findIndex(
                (usuario: any) =>
                    usuario.usuario_id === usuarioId
            ) + 1;

        const usuario =
            rows.find(
                (item: any) =>
                    item.usuario_id === usuarioId
            );

        return {
            posicao: posicao > 0 ? posicao : null,
            pontuacao: usuario
                ? Number(usuario.pontuacao)
                : 0
        };
    }

    static async updateScore(
        usuarioId: number,
        pontos: number
    ) {

        await db.execute(
            `INSERT INTO ranking_produtividade
                (usuario_id, pontuacao)
             VALUES (?, ?)
             ON DUPLICATE KEY UPDATE
                pontuacao = pontuacao + ?,
                ultima_atualizacao = CURRENT_TIMESTAMP`,
            [
                usuarioId,
                pontos,
                pontos
            ]
        );
    }
}