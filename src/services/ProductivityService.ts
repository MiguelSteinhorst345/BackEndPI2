import db from "../config/database";
import { ProgressService } from "./ProgressService";
import { NotificationModel } from "../models/Notification";

export class ProductivityService {

    static readonly PONTOS_TAREFA = 5;
    static readonly PONTOS_PROVA = 20;

    static async concluirTarefa(
        usuarioId: number,
        tarefaId: number
    ) {

        const [tarefas]: any = await db.execute(
            `SELECT
                t.id,
                t.concluida,
                t.materia_id
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
            throw new Error("Tarefa não encontrada.");
        }

        if (Boolean(tarefas[0].concluida)) {
            return {
                pontos: 0,
                progresso: null,
                mensagem: "Tarefa já estava concluída."
            };
        }

        const materiaId = tarefas[0].materia_id;

        await db.execute(
            `UPDATE tarefas
             SET concluida = TRUE
             WHERE id = ?`,
            [tarefaId]
        );

        const pontos = this.PONTOS_TAREFA;

        await this.adicionarPontos(
            usuarioId,
            pontos
        );

        const progresso =
            await ProgressService.atualizarMateria(
                materiaId
            );

        await NotificationModel.create({
            usuario_id: usuarioId,
            titulo: "Tarefa concluída",
            mensagem:
                `Parabéns! Você concluiu uma tarefa e ganhou ${pontos} pontos.`
        });

        return {
            pontos,
            progresso,
            mensagem:
                "Tarefa concluída com sucesso."
        };
    }


    static async realizarProva(
        usuarioId: number,
        provaId: number,
        nota: number
    ) {

        if (
            typeof nota !== "number" ||
            Number.isNaN(nota) ||
            nota < 0 ||
            nota > 10
        ) {
            throw new Error(
                "A nota deve estar entre 0 e 10."
            );
        }

        const [provas]: any = await db.execute(
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

        if (Boolean(provas[0].realizada)) {
            return {
                pontos: 0,
                mensagem: "Prova já estava realizada."
            };
        }

        await db.execute(
            `UPDATE provas
             SET realizada = TRUE,
                 nota = ?
             WHERE id = ?`,
            [
                nota,
                provaId
            ]
        );

        const pontos = this.PONTOS_PROVA;

        await this.adicionarPontos(
            usuarioId,
            pontos
        );

        await NotificationModel.create({
            usuario_id: usuarioId,
            titulo: "Prova realizada",
            mensagem:
                `Prova registrada com sucesso. Você ganhou ${pontos} pontos.`
        });

        return {
            pontos,
            nota,
            mensagem:
                "Prova registrada com sucesso."
        };
    }


    static async adicionarPontos(
        usuarioId: number,
        pontos: number
    ) {

        await db.execute(
            `INSERT INTO ranking_produtividade
            (
                usuario_id,
                pontuacao,
                ultima_atualizacao
            )
            VALUES (?, ?, CURRENT_TIMESTAMP)
            ON DUPLICATE KEY UPDATE
                pontuacao = pontuacao + ?,
                ultima_atualizacao = CURRENT_TIMESTAMP`,
            [
                usuarioId,
                pontos,
                pontos
            ]
        );

        await this.atualizarHistorico(
            usuarioId
        );
    }


    static async atualizarHistorico(
        usuarioId: number
    ) {

        const [tarefas]: any = await db.execute(
            `SELECT
                COUNT(*) AS total
             FROM tarefas t
             INNER JOIN materias m
                ON t.materia_id = m.id
             WHERE m.usuario_id = ?
             AND t.concluida = TRUE`,
            [usuarioId]
        );

        const [provas]: any = await db.execute(
            `SELECT
                COUNT(*) AS total
             FROM provas p
             INNER JOIN materias m
                ON p.materia_id = m.id
             WHERE m.usuario_id = ?
             AND p.realizada = TRUE`,
            [usuarioId]
        );

        const [ranking]: any = await db.execute(
            `SELECT
                pontuacao
             FROM ranking_produtividade
             WHERE usuario_id = ?`,
            [usuarioId]
        );

        const tarefasConcluidas =
            Number(tarefas[0]?.total || 0);

        const provasRealizadas =
            Number(provas[0]?.total || 0);

        const pontos =
            Number(ranking[0]?.pontuacao || 0);

        await db.execute(
            `INSERT INTO historico_desempenho
            (
                usuario_id,
                tarefas_concluidas,
                provas_realizadas,
                pontos_produtividade,
                data_registro
            )
            VALUES (?, ?, ?, ?, CURDATE())`,
            [
                usuarioId,
                tarefasConcluidas,
                provasRealizadas,
                pontos
            ]
        );
    }
}
