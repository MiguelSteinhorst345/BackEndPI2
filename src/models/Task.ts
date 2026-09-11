import db from "../config/database";

export class TaskModel {

    static async getAll(materia_id:number){
        const [rows]=await db.execute(
            "SELECT * FROM tarefas WHERE materia_id=? ORDER BY data_entrega",
            [materia_id]
        );
        return rows;
    }
    static async getById(id:number){
        const [rows]:any=await db.execute(
            "SELECT * FROM tarefas WHERE id=?",
            [id]
        );
        return rows[0];
    }
    static async create(data:any){
        const sql=`
        INSERT INTO tarefas
        (materia_id,titulo,descricao,data_entrega,prioridade)
        VALUES (?,?,?,?,?)
        `;
        return await db.execute(sql,[
            data.materia_id,
            data.titulo,
            data.descricao,
            data.data_entrega,
            data.prioridade
        ]);
    }
    static async update(id:number,data:any){
        return await db.execute(
            `UPDATE tarefas
             SET titulo=?,
                 descricao=?,
                 data_entrega=?,
                 prioridade=?
             WHERE id=?`,
            [
                data.titulo,
                data.descricao,
                data.data_entrega,
                data.prioridade,
                id
            ]
        );
    }
    static async complete(id:number){
        return await db.execute(
            "UPDATE tarefas SET concluida=true WHERE id=?",
            [id]
        );
    }
    static async delete(id:number){
        return await db.execute(
            "DELETE FROM tarefas WHERE id=?",
            [id]
        );
    }
}