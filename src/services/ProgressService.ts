import db from "../config/database";

export class ProgressService {

    static async atualizarMateria(materiaId: number) {
        const [resultado]: any = await db.execute(
            `SELECT
                COUNT(*) AS total,
                SUM(CASE WHEN concluida = true THEN 1 ELSE 0 END) AS concluidas
             FROM tarefas
             WHERE materia_id = ?`,
            [materiaId]
        );
        const total = Number(resultado[0].total);
        const concluidas = Number(resultado[0].concluidas || 0);
        let progresso = 0;
        if (total > 0) {
            progresso = (concluidas / total) * 100;
        }
        progresso = Number(progresso.toFixed(2));
        await db.execute(
            `UPDATE materias
             SET progresso = ?
             WHERE id = ?`,
            [
                progresso,
                materiaId
            ]
        );
        return progresso;
    }
    static async atualizarTodasDoUsuario(usuarioId: number) {
        const [materias]: any = await db.execute(
            `SELECT id
             FROM materias
             WHERE usuario_id = ?`,
            [usuarioId]
        );
        for (const materia of materias) {
            await this.atualizarMateria(
                materia.id
            );
        }
    }
    static async obterProgresso(materiaId: number) {
        const [materias]: any = await db.execute(
            `SELECT
                id,
                nome,
                progresso
             FROM materias
             WHERE id = ?`,
            [materiaId]
        );
        if (materias.length === 0) {
            throw new Error(
                "Matéria não encontrada."
            );
        }
        return materias[0];
    }
}