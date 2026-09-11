import db from "../config/database";

export class TaskService {

    static async verifySubject(
        usuarioId: number,
        materiaId: number
    ) {

        const [materias]: any = await db.execute(
            `SELECT id
             FROM materias
             WHERE id = ?
             AND usuario_id = ?`,
            [
                materiaId,
                usuarioId
            ]
        );

        return materias.length > 0;
    }

    static async create(
        usuarioId: number,
        materiaId: number,
        titulo: string,
        descricao: string | undefined,
        dataEntrega: string | undefined,
        prioridade: string | undefined
    ) {

        if (!materiaId) {
            throw new Error(
                "A matéria é obrigatória."
            );
        }

        if (!titulo || titulo.trim() === "") {
            throw new Error(
                "O título da tarefa é obrigatório."
            );
        }

        const prioridadesPermitidas = [
            "Baixa",
            "Média",
            "Alta"
        ];

        const prioridadeFinal =
            prioridade || "Média";


        if (
            !prioridadesPermitidas.includes(
                prioridadeFinal
            )
        ) {
            throw new Error(
                "Prioridade inválida. Use Baixa, Média ou Alta."
            );
        }

        const materiaPertence =
            await this.verifySubject(
                usuarioId,
                materiaId
            );

        if (!materiaPertence) {
            throw new Error(
                "Matéria não encontrada."
            );
        }

        const [result]: any =
            await db.execute(
                `INSERT INTO tarefas
                (
                    materia_id,
                    titulo,
                    descricao,
                    data_entrega,
                    prioridade,
                    concluida
                )
                VALUES (?, ?, ?, ?, ?, FALSE)`,
                [
                    materiaId,
                    titulo,
                    descricao || null,
                    dataEntrega || null,
                    prioridadeFinal
                ]
            );

        return {
            id: result.insertId,
            materia_id: materiaId,
            titulo,
            descricao: descricao || null,
            data_entrega: dataEntrega || null,
            prioridade: prioridadeFinal,
            concluida: false
        };
    }

    static async findAll(
        usuarioId: number
    ) {

        const [rows]: any =
            await db.execute(
                `SELECT
                    t.id,
                    t.materia_id,
                    m.nome AS materia,
                    t.titulo,
                    t.descricao,
                    t.data_entrega,
                    t.prioridade,
                    t.concluida,
                    t.data_criacao
                 FROM tarefas t
                 INNER JOIN materias m
                    ON t.materia_id = m.id
                 WHERE m.usuario_id = ?
                 ORDER BY
                    t.concluida ASC,
                    t.data_entrega ASC`,
                [usuarioId]
            );

        return rows;
    }

    static async findById(
        usuarioId: number,
        tarefaId: number
    ) {

        const [rows]: any =
            await db.execute(
                `SELECT
                    t.id,
                    t.materia_id,
                    m.nome AS materia,
                    t.titulo,
                    t.descricao,
                    t.data_entrega,
                    t.prioridade,
                    t.concluida,
                    t.data_criacao
                 FROM tarefas t
                 INNER JOIN materias m
                    ON t.materia_id = m.id
                 WHERE t.id = ?
                 AND m.usuario_id = ?`,
                [
                    tarefaId,
                    usuarioId
                ]
            );

        return rows;
    }

    static async update(
        usuarioId: number,
        tarefaId: number,
        materiaId: number,
        titulo: string,
        descricao: string | undefined,
        dataEntrega: string | undefined,
        prioridade: string | undefined
    ) {

        if (!titulo || titulo.trim() === "") {
            throw new Error(
                "O título da tarefa é obrigatório."
            );
        }

        const prioridadesPermitidas = [
            "Baixa",
            "Média",
            "Alta"
        ];

        const prioridadeFinal =
            prioridade || "Média";

        if (
            !prioridadesPermitidas.includes(
                prioridadeFinal
            )
        ) {
            throw new Error(
                "Prioridade inválida."
            );
        }

        const materiaPertence =
            await this.verifySubject(
                usuarioId,
                materiaId
            );

        if (!materiaPertence) {
            throw new Error(
                "Matéria não encontrada."
            );
        }

        const [result]: any =
            await db.execute(
                `UPDATE tarefas t
                 INNER JOIN materias m
                    ON t.materia_id = m.id
                 SET
                    t.materia_id = ?,
                    t.titulo = ?,
                    t.descricao = ?,
                    t.data_entrega = ?,
                    t.prioridade = ?
                 WHERE t.id = ?
                 AND m.usuario_id = ?`,
                [
                    materiaId,
                    titulo,
                    descricao || null,
                    dataEntrega || null,
                    prioridadeFinal,
                    tarefaId,
                    usuarioId
                ]
            );

        if (result.affectedRows === 0) {
            throw new Error(
                "Tarefa não encontrada."
            );
        }

        return {
            message:
                "Tarefa atualizada com sucesso."
        };
    }

    static async markAsDone(
        usuarioId: number,
        tarefaId: number
    ) {

        const [tarefas]: any =
            await db.execute(
                `SELECT
                    t.concluida
                 FROM tarefas t
                 INNER JOIN materias m
                    ON t.materia_id = m.id
                 WHERE t.id = ?
                 AND m.usuario_id = ?`,
                [
                    tarefaId,
                    usuarioId
                ]
            );

        if (tarefas.length === 0) {
            throw new Error(
                "Tarefa não encontrada."
            );
        }

        const jaConcluida =
            Boolean(tarefas[0].concluida);

        if (jaConcluida) {

            return {
                message:
                    "A tarefa já está concluída.",
                concluida: true,
                pontos: 0
            };
        }

        await db.execute(
            `UPDATE tarefas t
             INNER JOIN materias m
                ON t.materia_id = m.id
             SET t.concluida = TRUE
             WHERE t.id = ?
             AND m.usuario_id = ?`,
            [
                tarefaId,
                usuarioId
            ]
        );

        const pontos = 5;

        await db.execute(
            `INSERT INTO ranking_produtividade
            (
                usuario_id,
                pontuacao
            )
            VALUES (?, ?)
            ON DUPLICATE KEY UPDATE
                pontuacao =
                pontuacao + VALUES(pontuacao),
                ultima_atualizacao =
                CURRENT_TIMESTAMP`,
            [
                usuarioId,
                pontos
            ]
        );

        await db.execute(
            `INSERT INTO historico_desempenho
            (
                usuario_id,
                tarefas_concluidas,
                provas_realizadas,
                pontos_produtividade,
                data_registro
            )
            VALUES (?, 1, 0, ?, CURDATE())`,
            [
                usuarioId,
                pontos
            ]
        );

        await db.execute(
            `INSERT INTO notificacoes
            (
                usuario_id,
                titulo,
                mensagem
            )
            VALUES (?, ?, ?)`,
            [
                usuarioId,
                "Tarefa concluída!",
                `Parabéns! Você concluiu uma tarefa e ganhou ${pontos} pontos de produtividade.`
            ]
        );

        await this.updateSubjectProgress(
            usuarioId,
            tarefaId
        );

        return {
            message:
                "Tarefa concluída! Você ganhou 5 pontos.",
            concluida: true,
            pontos
        };
    }

    static async updateSubjectProgress(
        usuarioId: number,
        tarefaId: number
    ) {

        const [materias]: any =
            await db.execute(
                `SELECT
                    m.id
                 FROM tarefas t
                 INNER JOIN materias m
                    ON t.materia_id = m.id
                 WHERE t.id = ?
                 AND m.usuario_id = ?`,
                [
                    tarefaId,
                    usuarioId
                ]
            );

        if (materias.length === 0) {
            return;
        }

        const materiaId =
            materias[0].id;

        const [resultado]: any =
            await db.execute(
                `SELECT
                    COUNT(*) AS total,
                    SUM(
                        CASE
                            WHEN concluida = TRUE
                            THEN 1
                            ELSE 0
                        END
                    ) AS concluidas
                 FROM tarefas
                 WHERE materia_id = ?`,
                [materiaId]
            );

        const total =
            Number(resultado[0].total);

        const concluidas =
            Number(resultado[0].concluidas || 0);

        let progresso = 0;

        if (total > 0) {
            progresso =
                (concluidas / total) * 100;
        }

        await db.execute(
            `UPDATE materias
             SET progresso = ?
             WHERE id = ?
             AND usuario_id = ?`,
            [
                progresso,
                materiaId,
                usuarioId
            ]
        );
    }

    static async delete(
        usuarioId: number,
        tarefaId: number
    ) {

        const [result]: any =
            await db.execute(
                `DELETE t
                 FROM tarefas t
                 INNER JOIN materias m
                    ON t.materia_id = m.id
                 WHERE t.id = ?
                 AND m.usuario_id = ?`,
                [
                    tarefaId,
                    usuarioId
                ]
            );

        if (result.affectedRows === 0) {
            throw new Error(
                "Tarefa não encontrada."
            );
        }
        return {
            message:
                "Tarefa excluída com sucesso."
        };
    }
}