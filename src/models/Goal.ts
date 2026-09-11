import db from "../config/database";

export class GoalModel {

    static async getAll(usuario_id: number) {
        const [rows] = await db.execute(
            "SELECT * FROM metas_semanais WHERE usuario_id=? ORDER BY data_inicio DESC",
            [usuario_id]
        );
        return rows;
    }
    static async create(data: any) {
        return await db.execute(
            `INSERT INTO metas_semanais
            (usuario_id, descricao, objetivo, progresso, concluida, data_inicio, data_fim)
            VALUES (?, ?, ?, 0, false, ?, ?)`,
            [
                data.usuario_id,
                data.descricao,
                data.objetivo,
                data.data_inicio,
                data.data_fim
            ]
        );
    }
    static async update(id: number, data: any) {
        return await db.execute(
            `UPDATE metas_semanais
             SET descricao=?,
                 objetivo=?,
                 data_inicio=?,
                 data_fim=?
             WHERE id=?`,
            [
                data.descricao,
                data.objetivo,
                data.data_inicio,
                data.data_fim,
                id
            ]
        );
    }
    static async updateProgress(id: number, progresso: number) {
        return await db.execute(
            `UPDATE metas_semanais
             SET progresso=?,
                 concluida=(? >= objetivo)
             WHERE id=?`,
            [
                progresso,
                progresso,
                id
            ]
        );
    }
    static async delete(id: number) {
        return await db.execute(
            "DELETE FROM metas_semanais WHERE id=?",
            [id]
        );
    }
}