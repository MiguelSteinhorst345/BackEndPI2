import db from "../config/database";
export class DashboardService {

    static async getDashboard(usuarioId: number) {

        const [materias]: any = await db.execute(
            `SELECT
                id,
                nome,
                descricao,
                cor,
                progresso
             FROM materias
             WHERE usuario_id = ?
             ORDER BY id DESC`,
            [usuarioId]
        );

        const [tarefas]: any = await db.execute(
            `SELECT
                tarefas.id,
                tarefas.materia_id,
                tarefas.titulo,
                tarefas.descricao,
                tarefas.data_entrega,
                tarefas.prioridade,
                tarefas.concluida,
                materias.nome AS materia_nome
             FROM tarefas
             INNER JOIN materias
                ON materias.id = tarefas.materia_id
             WHERE materias.usuario_id = ?
             ORDER BY
                tarefas.concluida ASC,
                tarefas.data_entrega ASC`,
            [usuarioId]
        );


       
        const [provas]: any = await db.execute(
            `SELECT
                provas.id,
                provas.materia_id,
                provas.titulo,
                provas.descricao,
                provas.data_prova,
                provas.nota,
                provas.realizada,
                materias.nome AS materia_nome
             FROM provas
             INNER JOIN materias
                ON materias.id = provas.materia_id
             WHERE materias.usuario_id = ?
             ORDER BY
                provas.realizada ASC,
                provas.data_prova ASC`,
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
             ORDER BY data_inicio DESC`,
            [usuarioId]
        );

        const [estatisticas]: any = await db.execute(
            `SELECT
                COALESCE(
                    SUM(tarefas_concluidas),
                    0
                ) AS tarefas_concluidas,

                COALESCE(
                    SUM(provas_realizadas),
                    0
                ) AS provas_realizadas,

                COALESCE(
                    SUM(pontos_produtividade),
                    0
                ) AS pontos_produtividade

             FROM historico_desempenho
             WHERE usuario_id = ?`,
            [usuarioId]
        );

        return {

            materias,

            tarefas,

            provas,

            metas,

            estatisticas: {

                tarefas_concluidas:
                    Number(
                        estatisticas[0].tarefas_concluidas
                    ),

                provas_realizadas:
                    Number(
                        estatisticas[0].provas_realizadas
                    ),

                pontos_produtividade:
                    Number(
                        estatisticas[0].pontos_produtividade
                    )

            }

        };
    }

}