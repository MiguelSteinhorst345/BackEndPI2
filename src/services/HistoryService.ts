import db from "../config/database";

export class HistoryService {

    static async findAll(
        usuarioId: number
    ) {

        const [rows]: any = await db.execute(
            `SELECT
                id,
                tarefas_concluidas,
                provas_realizadas,
                pontos_produtividade,
                data_registro
             FROM historico_desempenho
             WHERE usuario_id = ?
             ORDER BY data_registro DESC, id DESC`,
            [usuarioId]
        );

        return rows;
    }

    static async getSummary(
        usuarioId: number
    ) {

        const [resultado]: any = await db.execute(
            `SELECT
                COALESCE(SUM(tarefas_concluidas), 0)
                    AS tarefas_concluidas,

                COALESCE(SUM(provas_realizadas), 0)
                    AS provas_realizadas,

                COALESCE(SUM(pontos_produtividade), 0)
                    AS pontos_produtividade

             FROM historico_desempenho
             WHERE usuario_id = ?`,
            [usuarioId]
        );

        return {
            tarefas_concluidas:
                Number(resultado[0].tarefas_concluidas),

            provas_realizadas:
                Number(resultado[0].provas_realizadas),

            pontos_produtividade:
                Number(resultado[0].pontos_produtividade)
        };
    }

    static async findByDate(
        usuarioId: number,
        data: string
    ) {

        const [rows]: any = await db.execute(
            `SELECT
                id,
                tarefas_concluidas,
                provas_realizadas,
                pontos_produtividade,
                data_registro
             FROM historico_desempenho
             WHERE usuario_id = ?
             AND data_registro = ?
             ORDER BY id DESC`,
            [
                usuarioId,
                data
            ]
        );

        return rows;
    }

}