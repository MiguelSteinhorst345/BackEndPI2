import db from "../config/database";

export class ExamModel {

    static async getAll(materia:number){
        const [rows]=await db.execute(
            "SELECT * FROM provas WHERE materia_id=? ORDER BY data_prova",
            [materia]
        );
        return rows;
    }
    static async create(data:any){
        const sql=`
        INSERT INTO provas
        (materia_id,titulo,descricao,data_prova)
        VALUES (?,?,?,?)
        `;
        return await db.execute(sql,[
            data.materia_id,
            data.titulo,
            data.descricao,
            data.data_prova
        ]);
    }
    static async update(id:number,data:any){
        return await db.execute(
            `UPDATE provas
            SET titulo=?,
                descricao=?,
                data_prova=?
            WHERE id=?`,
            [
                data.titulo,
                data.descricao,
                data.data_prova,
                id
            ]
        );
    }
    static async finish(id:number,nota:number){
        return await db.execute(
            `UPDATE provas
            SET realizada=true,
                nota=?
            WHERE id=?`,
            [
                nota,
                id
            ]
        );
    }
    static async delete(id:number){
        return await db.execute(
            "DELETE FROM provas WHERE id=?",
            [id]
        );
    }
}