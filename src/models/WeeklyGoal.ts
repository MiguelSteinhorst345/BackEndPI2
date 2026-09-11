import db from "../config/database";

export class WeeklyGoalModel{
    static async create(data:any){
        const sql=`
        INSERT INTO metas_semanais
        (usuario_id,descricao,objetivo,data_inicio,data_fim)
        VALUES (?,?,?,?,?)
        `;
        return await db.execute(sql,[
            data.usuario_id,
            data.descricao,
            data.objetivo,
            data.data_inicio,
            data.data_fim
        ]);
    }
}