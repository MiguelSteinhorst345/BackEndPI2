import db from "../config/database";

export class RankingModel {

    static async getRanking() {
        const [rows] = await db.execute(
            `SELECT
                r.id,
                u.nome,
                r.pontuacao,
                r.ultima_atualizacao
            FROM ranking_produtividade r
            INNER JOIN usuarios u
            ON r.usuario_id = u.id
            ORDER BY r.pontuacao DESC`
        );
        return rows;
    }
    static async update(usuario_id: number, pontuacao: number) {
        const [rows]: any = await db.execute(
            "SELECT * FROM ranking_produtividade WHERE usuario_id=?",
            [usuario_id]
        );
        if (rows.length > 0) {
            return await db.execute(
                `UPDATE ranking_produtividade
                 SET pontuacao=?,
                     ultima_atualizacao=NOW()
                 WHERE usuario_id=?`,
                [pontuacao, usuario_id]
            );
        }
        return await db.execute(
            `INSERT INTO ranking_produtividade
            (usuario_id,pontuacao)
            VALUES (?,?)`,
            [usuario_id, pontuacao]
        );
    }
}
