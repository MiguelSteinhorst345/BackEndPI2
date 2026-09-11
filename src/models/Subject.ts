import db from "../config/database";

export interface SubjectData {
    usuario_id: number;
    nome: string;
    descricao?: string;
    cor?: string;
}

export class SubjectModel {

    static async getAll(usuarioId: number) {
        const [rows] = await db.execute(
            `SELECT
                id,
                usuario_id,
                nome,
                descricao,
                cor,
                progresso
             FROM materias
             WHERE usuario_id = ?
             ORDER BY nome`,
            [usuarioId]
        );

        return rows;
    }

    static async getById(
        id: number,
        usuarioId: number
    ) {
        const [rows]: any = await db.execute(
            `SELECT
                id,
                usuario_id,
                nome,
                descricao,
                cor,
                progresso
             FROM materias
             WHERE id = ?
             AND usuario_id = ?`,
            [
                id,
                usuarioId
            ]
        );

        return rows[0];
    }

    static async create(data: SubjectData) {
        const [result]: any = await db.execute(
            `INSERT INTO materias
            (
                usuario_id,
                nome,
                descricao,
                cor
            )
            VALUES (?, ?, ?, ?)`,
            [
                data.usuario_id,
                data.nome,
                data.descricao || null,
                data.cor || null
            ]
        );

        return {
            id: result.insertId,
            usuario_id: data.usuario_id,
            nome: data.nome,
            descricao: data.descricao || null,
            cor: data.cor || null
        };
    }

    static async update(
        id: number,
        usuarioId: number,
        data: any
    ) {
        const [result]: any = await db.execute(
            `UPDATE materias
             SET
                nome = ?,
                descricao = ?,
                cor = ?
             WHERE id = ?
             AND usuario_id = ?`,
            [
                data.nome,
                data.descricao || null,
                data.cor || null,
                id,
                usuarioId
            ]
        );

        return result;
    }

    static async delete(
        id: number,
        usuarioId: number
    ) {
        const [result]: any = await db.execute(
            `DELETE FROM materias
             WHERE id = ?
             AND usuario_id = ?`,
            [
                id,
                usuarioId
            ]
        );

        return result;
    }
}
