import db from "../config/database";

export interface User {
    id?: number;
    nome: string;
    email: string;
    senha: string;
    foto_perfil?: string;
    modo_escuro?: boolean;
}
export class UserModel {
    static async create(user: User) {
        const sql = `
        INSERT INTO usuarios
        (nome,email,senha,foto_perfil,modo_escuro)
        VALUES (?,?,?,?,?)
        `;
        const [result]: any = await db.execute(sql,[
            user.nome,
            user.email,
            user.senha,
            user.foto_perfil || null,
            user.modo_escuro || false
        ]);
        return result.insertId;
    }
    static async findByEmail(email:string){
        const [rows]:any = await db.execute(
            "SELECT * FROM usuarios WHERE email=?",
            [email]
        );
        return rows[0];
    }
    static async findById(id:number){
        const [rows]:any = await db.execute(
            "SELECT * FROM usuarios WHERE id=?",
            [id]
        );
        return rows[0];
    }
}