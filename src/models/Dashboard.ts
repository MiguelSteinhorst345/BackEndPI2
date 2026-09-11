import db from "../config/database";

export class DashboardModel {

    static async getDashboard(usuario_id: number) {
        const [materias] = await db.execute(
            "SELECT * FROM materias WHERE usuario_id=?",
            [usuario_id]
        );
        const [tarefas] = await db.execute(
            `SELECT t.*
             FROM tarefas t
             INNER JOIN materias m
             ON t.materia_id=m.id
             WHERE m.usuario_id=?`,
            [usuario_id]
        );
        const [provas] = await db.execute(
            `SELECT p.*
             FROM provas p
             INNER JOIN materias m
             ON p.materia_id=m.id
             WHERE m.usuario_id=?`,
            [usuario_id]
        );
        const [metas] = await db.execute(
            "SELECT * FROM metas_semanais WHERE usuario_id=?",
            [usuario_id]
        );
        return {
            materias,
            tarefas,
            provas,
            metas
        };
    }
}