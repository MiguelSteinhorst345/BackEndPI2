import db from "../config/database";

export class ExamService {

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
        dataProva: string
    ) {

        if (!materiaId) {
            throw new Error(
                "A matéria é obrigatória."
            );
        }

        if (!titulo || titulo.trim() === "") {
            throw new Error(
                "O título da prova é obrigatório."
            );
        }

        if (!dataProva) {
            throw new Error(
                "A data da prova é obrigatória."
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
                `INSERT INTO provas
                (
                    materia_id,
                    titulo,
                    descricao,
                    data_prova,
                    realizada
                )
                VALUES (?, ?, ?, ?, FALSE)`,
                [
                    materiaId,
                    titulo,
                    descricao || null,
                    dataProva
                ]
            );

        return {
            id: result.insertId,
            materia_id: materiaId,
            titulo,
            descricao: descricao || null,
            data_prova: dataProva,
            nota: null,
            realizada: false
        };
    }

    static async findAll(
        usuarioId: number
    ) {

        const [rows]: any =
            await db.execute(
                `SELECT
                    p.id,
                    p.materia_id,
                    m.nome AS materia,
                    p.titulo,
                    p.descricao,
                    p.data_prova,
                    p.nota,
                    p.realizada
                 FROM provas p
                 INNER JOIN materias m
                    ON p.materia_id = m.id
                 WHERE m.usuario_id = ?
                 ORDER BY
                    p.realizada ASC,
                    p.data_prova ASC`,
                [usuarioId]
            );


        return rows;
    }

    static async findById(
        usuarioId: number,
        provaId: number
    ) {

        const [rows]: any =
            await db.execute(
                `SELECT
                    p.id,
                    p.materia_id,
                    m.nome AS materia,
                    p.titulo,
                    p.descricao,
                    p.data_prova,
                    p.nota,
                    p.realizada
                 FROM provas p
                 INNER JOIN materias m
                    ON p.materia_id = m.id
                 WHERE p.id = ?
                 AND m.usuario_id = ?`,
                [
                    provaId,
                    usuarioId
                ]
            );


        return rows;
    }

    static async update(
        usuarioId: number,
        provaId: number,
        materiaId: number,
        titulo: string,
        descricao: string | undefined,
        dataProva: string
    ) {

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
                `UPDATE provas p
                 INNER JOIN materias m
                    ON p.materia_id = m.id
                 SET
                    p.materia_id = ?,
                    p.titulo = ?,
                    p.descricao = ?,
                    p.data_prova = ?
                 WHERE p.id = ?
                 AND m.usuario_id = ?`,
                [
                    materiaId,
                    titulo,
                    descricao || null,
                    dataProva,
                    provaId,
                    usuarioId
                ]
            );

        if (result.affectedRows === 0) {
            throw new Error(
                "Prova não encontrada."
            );
        }

        return {
            message:
                "Prova atualizada com sucesso."
        };
    }

    static async updateGrade(
        usuarioId: number,
        provaId: number,
        nota: number
    ) {

        if (nota < 0 || nota > 10) {
            throw new Error(
                "A nota deve estar entre 0 e 10."
            );
        }

        const [provas]: any =
            await db.execute(
                `SELECT
                    p.id,
                    p.realizada
                 FROM provas p
                 INNER JOIN materias m
                    ON p.materia_id = m.id
                 WHERE p.id = ?
                 AND m.usuario_id = ?`,
                [
                    provaId,
                    usuarioId
                ]
            );

        if (provas.length === 0) {
            throw new Error(
                "Prova não encontrada."
            );
        }

        await db.execute(
            `UPDATE provas
             SET nota = ?
             WHERE id = ?`,
            [
                nota,
                provaId
            ]
        );

        return {
            message:
                "Nota registrada com sucesso.",
            nota
        };
    }

    static async markAsDone(
        usuarioId: number,
        provaId: number
    ) {

        const [provas]: any =
            await db.execute(
                `SELECT
                    p.realizada
                 FROM provas p
                 INNER JOIN materias m
                    ON p.materia_id = m.id
                 WHERE p.id = ?
                 AND m.usuario_id = ?`,
                [
                    provaId,
                    usuarioId
                ]
            );

        if (provas.length === 0) {
            throw new Error(
                "Prova não encontrada."
            );
        }

        const jaRealizada =
            Boolean(provas[0].realizada);

        if (jaRealizada) {

            return {
                message:
                    "A prova já está marcada como realizada.",
                realizada: true
            };

        }

        await db.execute(
            `UPDATE provas
             SET realizada = TRUE
             WHERE id = ?`,
            [provaId]
        );

        const pontos = 10;

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
            VALUES (?, 0, 1, ?, CURDATE())`,
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
                "Prova realizada!",
                `Você marcou uma prova como realizada e ganhou ${pontos} pontos de produtividade.`
            ]
        );

        return {
            message:
                "Prova marcada como realizada! Você ganhou 10 pontos.",
            realizada: true,
            pontos
        };
    }

    static async delete(
        usuarioId: number,
        provaId: number
    ) {

        const [result]: any =
            await db.execute(
                `DELETE p
                 FROM provas p
                 INNER JOIN materias m
                    ON p.materia_id = m.id
                 WHERE p.id = ?
                 AND m.usuario_id = ?`,
                [
                    provaId,
                    usuarioId
                ]
            );


        if (result.affectedRows === 0) {
            throw new Error(
                "Prova não encontrada."
            );
        }


        return {
            message:
                "Prova excluída com sucesso."
        };
    }

}