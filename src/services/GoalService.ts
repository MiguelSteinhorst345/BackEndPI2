import db from "../config/database";

export class GoalService {

    static async create(
        usuarioId: number,
        descricao: string,
        objetivo: number,
        dataInicio?: string,
        dataFim?: string
    ) {

        if (!descricao || descricao.trim() === "") {
            throw new Error("A descrição da meta é obrigatória.");
        }

        if (!objetivo || objetivo <= 0) {
            throw new Error("O objetivo deve ser maior que zero.");
        }

        const [result]: any = await db.execute(
            `INSERT INTO metas_semanais
            (
                usuario_id,
                descricao,
                objetivo,
                progresso,
                concluida,
                data_inicio,
                data_fim
            )
            VALUES (?, ?, ?, 0, FALSE, ?, ?)`,
            [
                usuarioId,
                descricao,
                objetivo,
                dataInicio || null,
                dataFim || null
            ]
        );

        return {
            id: result.insertId,
            usuario_id: usuarioId,
            descricao,
            objetivo,
            progresso: 0,
            concluida: false,
            data_inicio: dataInicio || null,
            data_fim: dataFim || null
        };
    }

    static async findAll(usuarioId: number) {

        const [rows]: any = await db.execute(
            `SELECT
                id,
                descricao,
                objetivo,
                progresso,
                concluida,
                data_inicio,
                data_fim
             FROM metas_semanais
             WHERE usuario_id = ?
             ORDER BY data_inicio ASC, id DESC`,
            [usuarioId]
        );

        return rows;
    }

    static async findById(
        usuarioId: number,
        metaId: number
    ) {

        const [rows]: any = await db.execute(
            `SELECT
                id,
                descricao,
                objetivo,
                progresso,
                concluida,
                data_inicio,
                data_fim
             FROM metas_semanais
             WHERE id = ?
             AND usuario_id = ?`,
            [
                metaId,
                usuarioId
            ]
        );

        return rows;
    }

    static async update(
        usuarioId: number,
        metaId: number,
        descricao: string,
        objetivo: number,
        dataInicio?: string,
        dataFim?: string
    ) {

        if (!descricao || descricao.trim() === "") {
            throw new Error("A descrição da meta é obrigatória.");
        }

        if (!objetivo || objetivo <= 0) {
            throw new Error("O objetivo deve ser maior que zero.");
        }

        const [result]: any = await db.execute(
            `UPDATE metas_semanais
             SET
                descricao = ?,
                objetivo = ?,
                data_inicio = ?,
                data_fim = ?
             WHERE id = ?
             AND usuario_id = ?`,
            [
                descricao,
                objetivo,
                dataInicio || null,
                dataFim || null,
                metaId,
                usuarioId
            ]
        );

        if (result.affectedRows === 0) {
            throw new Error("Meta não encontrada.");
        }

        return {
            message: "Meta atualizada com sucesso."
        };
    }

    static async updateProgress(
        usuarioId: number,
        metaId: number,
        progresso: number
    ) {

        if (progresso < 0) {
            throw new Error("O progresso não pode ser negativo.");
        }

        const [metas]: any = await db.execute(
            `SELECT
                objetivo,
                progresso,
                concluida
             FROM metas_semanais
             WHERE id = ?
             AND usuario_id = ?`,
            [
                metaId,
                usuarioId
            ]
        );

        if (metas.length === 0) {
            throw new Error("Meta não encontrada.");
        }

        const objetivo = Number(metas[0].objetivo);

        let novoProgresso = Number(progresso);

        if (novoProgresso > objetivo) {
            novoProgresso = objetivo;
        }

        const concluida =
            novoProgresso >= objetivo;


        await db.execute(
            `UPDATE metas_semanais
             SET
                progresso = ?,
                concluida = ?
             WHERE id = ?
             AND usuario_id = ?`,
            [
                novoProgresso,
                concluida,
                metaId,
                usuarioId
            ]
        );


        // Se completou a meta, adiciona pontos
        if (
            concluida &&
            !Boolean(metas[0].concluida)
        ) {

            const pontos = 20;

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
                VALUES (?, 0, 0, ?, CURDATE())`,
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
                    "Meta concluída!",
                    `Parabéns! Você concluiu uma meta semanal e ganhou ${pontos} pontos.`
                ]
            );
        }


        return {
            message: concluida
                ? "Meta concluída! Você ganhou 20 pontos."
                : "Progresso atualizado com sucesso.",
            progresso: novoProgresso,
            objetivo,
            concluida,
            pontos: concluida ? 20 : 0
        };
    }

    static async markAsDone(
        usuarioId: number,
        metaId: number
    ) {

        const [metas]: any = await db.execute(
            `SELECT
                objetivo,
                progresso,
                concluida
             FROM metas_semanais
             WHERE id = ?
             AND usuario_id = ?`,
            [
                metaId,
                usuarioId
            ]
        );

        if (metas.length === 0) {
            throw new Error("Meta não encontrada.");
        }

        const objetivo = Number(metas[0].objetivo);


        if (Boolean(metas[0].concluida)) {

            return {
                message: "A meta já está concluída.",
                concluida: true,
                pontos: 0
            };
        }


        await db.execute(
            `UPDATE metas_semanais
             SET
                progresso = ?,
                concluida = TRUE
             WHERE id = ?
             AND usuario_id = ?`,
            [
                objetivo,
                metaId,
                usuarioId
            ]
        );


        const pontos = 20;


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
            VALUES (?, 0, 0, ?, CURDATE())`,
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
                "Meta concluída!",
                `Parabéns! Você concluiu uma meta semanal e ganhou ${pontos} pontos.`
            ]
        );


        return {
            message:
                "Meta concluída! Você ganhou 20 pontos.",
            progresso: objetivo,
            objetivo,
            concluida: true,
            pontos
        };
    }

    static async delete(
        usuarioId: number,
        metaId: number
    ) {

        const [result]: any = await db.execute(
            `DELETE FROM metas_semanais
             WHERE id = ?
             AND usuario_id = ?`,
            [
                metaId,
                usuarioId
            ]
        );

        if (result.affectedRows === 0) {
            throw new Error("Meta não encontrada.");
        }

        return {
            message: "Meta excluída com sucesso."
        };
    }
}