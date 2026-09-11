import db from "../config/database";

export class DashboardService {

    static async getDashboard(usuarioId: number) {

        const [usuarios]: any = await db.execute(
            `SELECT
                id,
                nome,
                email,
                foto_perfil,
                modo_escuro
             FROM usuarios
             WHERE id = ?`,
            [usuarioId]
        );

        if (usuarios.length === 0) {
            throw new Error("Usuário não encontrado.");
        }

        const usuario = usuarios[0];

        const [materias]: any = await db.execute(
            `SELECT
                id,
                nome,
                descricao,
                cor,
                progresso
             FROM materias
             WHERE usuario_id = ?
             ORDER BY nome ASC`,
            [usuarioId]
        );

        const [tarefas]: any = await db.execute(
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

        const [provas]: any = await db.execute(
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

        const [metas]: any = await db.execute(
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
             ORDER BY data_fim ASC`,
            [usuarioId]
        );

        const [notificacoes]: any = await db.execute(
            `SELECT
                id,
                titulo,
                mensagem,
                lida,
                data_envio
             FROM notificacoes
             WHERE usuario_id = ?
             ORDER BY
                lida ASC,
                data_envio DESC
             LIMIT 10`,
            [usuarioId]
        );

        const [ranking]: any = await db.execute(
            `SELECT
                pontuacao
             FROM ranking_produtividade
             WHERE usuario_id = ?`,
            [usuarioId]
        );

        const pontuacao =
            ranking.length > 0
                ? Number(ranking[0].pontuacao)
                : 0;

        const tarefasConcluidas =
            tarefas.filter(
                (tarefa: any) =>
                    Boolean(tarefa.concluida)
            ).length;

        const tarefasPendentes =
            tarefas.filter(
                (tarefa: any) =>
                    !Boolean(tarefa.concluida)
            ).length;


        const provasRealizadas =
            provas.filter(
                (prova: any) =>
                    Boolean(prova.realizada)
            ).length;

        const provasPendentes =
            provas.filter(
                (prova: any) =>
                    !Boolean(prova.realizada)
            ).length;

        const metasConcluidas =
            metas.filter(
                (meta: any) =>
                    Boolean(meta.concluida)
            ).length;

        const metasPendentes =
            metas.filter(
                (meta: any) =>
                    !Boolean(meta.concluida)
            ).length;

        const notificacoesNaoLidas =
            notificacoes.filter(
                (notificacao: any) =>
                    !Boolean(notificacao.lida)
            ).length;

        return {

            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                foto_perfil: usuario.foto_perfil,
                modo_escuro: Boolean(
                    usuario.modo_escuro
                )
            },
            materias,

            tarefas,

            provas,

            metas,

            notificacoes,

            produtividade: {
                pontuacao
            },

            resumo: {
                total_materias: materias.length,

                total_tarefas: tarefas.length,

                tarefas_concluidas:
                    tarefasConcluidas,

                tarefas_pendentes:
                    tarefasPendentes,

                total_provas: provas.length,

                provas_realizadas:
                    provasRealizadas,

                provas_pendentes:
                    provasPendentes,

                total_metas: metas.length,

                metas_concluidas:
                    metasConcluidas,

                metas_pendentes:
                    metasPendentes,

                notificacoes_nao_lidas:
                    notificacoesNaoLidas
            }
        };
    }

}