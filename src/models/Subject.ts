import db from "../config/database";

export class SubjectModel {
    static async getAll(userId: number) {
        const [rows] = await db.execute(
            "SELECT * FROM materias WHERE usuario_id=? ORDER BY nome",
            [userId]
        );
        return rows;
    }
    static async getById(id: number) {
        const [rows]: any = await db.execute(
            "SELECT * FROM materias WHERE id=?",
            [id]
        );
        return rows[0];
    }
    static async create(data: any) {
        const sql = `
        INSERT INTO materias
        (usuario_id,nome,descricao,cor)
        VALUES (?,?,?,?)
        `;
        return await db.execute(sql,[
            data.usuario_id,
            data.nome,
            data.descricao,
            data.cor
        ]);
    }
    static async update(id:number,data:any){
        return await db.execute(
            `UPDATE materias
             SET nome=?,
                 descricao=?,
                 cor=?
             WHERE id=?`,
            [
                data.nome,
                data.descricao,
                data.cor,
                id
            ]
        );
    }
    static async delete(id:number){
        return await db.execute(
            "DELETE FROM materias WHERE id=?",
            [id]
        );
    }
}