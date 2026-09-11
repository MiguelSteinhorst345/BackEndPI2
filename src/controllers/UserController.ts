import { Request, Response } from "express";
import bcrypt from "bcrypt";
import db from "../config/database";

export class UserController {
    static async profile(req: Request, res: Response) {
        try {
            const usuarioId = (req as any).user.id;
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
                return res.status(404).json({
                    message: "Usuário não encontrado."
                });
            }
            res.json(rows[0]);
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: "Erro ao buscar perfil."
            });
        }
    }
    static async updateProfile(req: Request, res: Response) {
        try {
            const usuarioId = (req as any).user.id;
            const {
                nome,
                email,
                modo_escuro
            } = req.body;
            if (!nome || !email) {
                return res.status(400).json({
                    message: "Nome e email são obrigatórios."
                });
            }
            await db.execute(
                `UPDATE usuarios
                 SET nome = ?,
                     email = ?,
                     modo_escuro = ?
                 WHERE id = ?`,
                [
                    nome,
                    email,
                    modo_escuro ?? false,
                    usuarioId
                ]
            );
            res.json({
                message: "Perfil atualizado com sucesso."
            });
        } catch (error: any) {
            console.error(error);
            if (error.code === "ER_DUP_ENTRY") {
                return res.status(409).json({
                    message: "Este email já está sendo utilizado."
                });
            }
            res.status(500).json({
                message: "Erro ao atualizar perfil."
            });
        }
    }
    static async updatePassword(req: Request, res: Response) {
        try {
            const usuarioId = (req as any).user.id;
            const {
                senhaAtual,
                novaSenha
            } = req.body;
            if (!senhaAtual || !novaSenha) {
                return res.status(400).json({
                    message: "Informe a senha atual e a nova senha."
                });
            }
            const [rows]: any = await db.execute(
                "SELECT senha FROM usuarios WHERE id = ?",
                [usuarioId]
            );
            if (rows.length === 0) {
                return res.status(404).json({
                    message: "Usuário não encontrado."
                });
            }
            const senhaCorreta = await bcrypt.compare(
                senhaAtual,
                rows[0].senha
            );
            if (!senhaCorreta) {
                return res.status(401).json({
                    message: "Senha atual incorreta."
                });
            }
            const senhaHash = await bcrypt.hash(
                novaSenha,
                10
            );
            await db.execute(
                "UPDATE usuarios SET senha = ? WHERE id = ?",
                [
                    senhaHash,
                    usuarioId
                ]
            );
            res.json({
                message: "Senha alterada com sucesso."
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: "Erro ao alterar senha."
            });
        }
    }
 static async updateDarkMode(req: Request, res: Response) {
    try {
        const usuarioId = (req as any).user.id;
        const { modo_escuro } = req.body;
        console.log("ID do usuário:", usuarioId);
        console.log("Modo escuro:", modo_escuro);
        if (typeof modo_escuro !== "boolean") {
            return res.status(400).json({
                message: "modo_escuro deve ser true ou false."
            });
        }
        const [result]: any = await db.execute(
            `UPDATE usuarios
             SET modo_escuro = ?
             WHERE id = ?`,
            [
                modo_escuro,
                usuarioId
            ]
        );
        console.log("Resultado:", result);
        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Usuário não encontrado."
            });
        }
        res.json({
            message: "Modo escuro atualizado com sucesso.",
            modo_escuro: modo_escuro
        });
    } catch (error) {
        console.error("ERRO NO MODO ESCURO:", error);
        res.status(500).json({
            message: "Erro interno ao atualizar modo escuro."
        });
    }
}
}