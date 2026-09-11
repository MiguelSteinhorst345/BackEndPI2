/*
import db from "../config/database";

export class ProfileService {

    static async getProfile(
        usuarioId: number
    ) {

        const [rows]: any = await db.execute(
            `SELECT
                id,
                nome,
                email,
                foto_perfil,
                modo_escuro,
                data_criacao
             FROM usuarios
             WHERE id = ?`,
            [usuarioId]
        );

        if (rows.length === 0) {
            return null;
        }

        return rows[0];
    }

    static async updateProfile(
        usuarioId: number,
        nome?: string,
        email?: string,
        fotoPerfil?: string,
        modoEscuro?: boolean
    ) {

        const campos: string[] = [];
        const valores: any[] = [];

        if (nome !== undefined) {

            campos.push("nome = ?");
            valores.push(nome);

        }

        if (email !== undefined) {

            campos.push("email = ?");
            valores.push(email);

        }

        if (fotoPerfil !== undefined) {

            campos.push("foto_perfil = ?");
            valores.push(fotoPerfil);

        }

        if (modoEscuro !== undefined) {

            campos.push("modo_escuro = ?");
            valores.push(modoEscuro);

        }

        if (campos.length === 0) {

            throw new Error(
                "Nenhum dado foi informado para atualização."
            );

        }

        valores.push(usuarioId);


        const sql = `
            UPDATE usuarios
            SET ${campos.join(", ")}
            WHERE id = ?
        `;

        await db.execute(
            sql,
            valores
        );

        return await ProfileService.getProfile(
            usuarioId
        );
    }

    static async updateDarkMode(
        usuarioId: number,
        modoEscuro: boolean
    ) {

        await db.execute(
            `UPDATE usuarios
             SET modo_escuro = ?
             WHERE id = ?`,
            [
                modoEscuro,
                usuarioId
            ]
        );

        return await ProfileService.getProfile(
            usuarioId
        );
    }

}
    
    */