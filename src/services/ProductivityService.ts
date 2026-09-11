import db from "../config/database";
import { ProgressService } from "./ProgressService";
import { NotificationModel } from "../models/Notification";

export class ProductivityService {
    static readonly PONTOS_TAREFA = 10;
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
            throw new Error(
                "Tarefa não encontrada."
            );
        }
        if (tarefas[0].concluida) {
            return {
                pontos: 0,
                progresso: null,
                mensagem: "Tarefa já estava concluída."
            };
        }
        const materiaId = tarefas[0].materia_id;
        await db.execute(
            `UPDATE tarefas
             SET concluida = true
             WHERE id = ?`,
            [tarefaId]
        );
        await this.adicionarPontos(
            usuarioId,
            this.PONTOS_TAREFA
        );
        const progresso =
            await ProgressService.atualizarMateria(
                materiaId
            );
        await NotificationModel.create({
            usuario_id: usuarioId,
            titulo: "Tarefa concluída",
            mensagem:
                `Parabéns! Você concluiu uma tarefa e ganhou ${this.PONTOS_TAREFA} pontos.`
        });
        return {
            pontos: this.PONTOS_TAREFA,
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
        if (provas[0].realizada) {
            return {
                pontos: 0,
                mensagem: "Prova já estava realizada."
            };
        }
        await db.execute(
            `UPDATE provas
             SET realizada = true,
                 nota = ?
             WHERE id = ?`,
            [
                nota,
                provaId
            ]
        );
        await this.adicionarPontos(
            usuarioId,
            this.PONTOS_PROVA
        );
        await NotificationModel.create({
            usuario_id: usuarioId,
            titulo: "Prova realizada",
            mensagem:
                `Prova registrada com sucesso. Você ganhou ${this.PONTOS_PROVA} pontos.`
        });
        return {
            pontos: this.PONTOS_PROVA,
            mensagem:
                "Prova registrada com sucesso."
        };
    }
    static async adicionarPontos(
        usuarioId: number,
        pontos: number
    ) {
        const [ranking]: any = await db.execute(
            `SELECT id, pontuacao
             FROM ranking_produtividade
             WHERE usuario_id = ?`,
            [usuarioId]
        );
        if (ranking.length === 0) {
            await db.execute(
                `INSERT INTO ranking_produtividade
                (usuario_id, pontuacao)
                VALUES (?, ?)`,
                [
                    usuarioId,
                    pontos
                ]
            );
        } else {
            await db.execute(
                `UPDATE ranking_produtividade
                 SET pontuacao = pontuacao + ?,
                     ultima_atualizacao = NOW()
                 WHERE usuario_id = ?`,
                [
                    pontos,
                    usuarioId
                ]
            );
        }
        await this.atualizarHistorico(usuarioId);
    }
    static async atualizarHistorico(
        usuarioId: number
    ) {
        const [tarefas]: any = await db.execute(
            `SELECT COUNT(*) AS total
             FROM tarefas t
             INNER JOIN materias m
                ON t.materia_id = m.id
             WHERE m.usuario_id = ?
             AND t.concluida = true`,
            [usuarioId]
        );
        const [provas]: any = await db.execute(
            `SELECT COUNT(*) AS total
             FROM provas p
             INNER JOIN materias m
                ON p.materia_id = m.id
             WHERE m.usuario_id = ?
             AND p.realizada = true`,
            [usuarioId]
        );
        const [ranking]: any = await db.execute(
            `SELECT pontuacao
             FROM ranking_produtividade
             WHERE usuario_id = ?`,
            [usuarioId]
        );
        const tarefasConcluidas =
            tarefas[0].total;
        const provasRealizadas =
            provas[0].total;
        const pontos =
            ranking.length > 0
                ? ranking[0].pontuacao
                : 0;
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