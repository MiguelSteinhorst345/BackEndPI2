import db from "../config/database";

export class HistoryModel {

    static async getAll(usuario_id: number) {
        const [rows] = await db.execute(
            `SELECT * FROM historico_desempenho
             WHERE usuario_id=?
             ORDER BY data_registro DESC`,
            [usuario_id]
        );
        return rows;
    }
    static async create(data: any) {
        return await db.execute(
            `INSERT INTO historico_desempenho
            (usuario_id,tarefas_concluidas,provas_realizadas,pontos_produtividade,data_registro)
            VALUES (?,?,?,?,CURDATE())`,
            [
                data.usuario_id,
                data.tarefas_concluidas,
                data.provas_realizadas,
                data.pontos_produtividade
            ]
        );
    }
}