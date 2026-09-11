import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/User";

export class AuthController {
    static async register(req: Request, res: Response) {
        try {
            const { nome, email, senha } = req.body;
            const existe = await UserModel.findByEmail(email);
            if (existe) {
                return res.status(400).json({
                    message: "E-mail já cadastrado."
                });
            }
            const senhaHash = await bcrypt.hash(senha, 10);
            const id = await UserModel.create({
                nome,
                email,
                senha: senhaHash
            });
            return res.status(201).json({
                message: "Usuário criado com sucesso.",
                id
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: "Erro ao cadastrar usuário."
            });
        }
    }
    static async login(req: Request, res: Response) {
        try {
            const { email, senha } = req.body;
            const usuario = await UserModel.findByEmail(email);
            if (!usuario) {
                return res.status(401).json({
                    message: "Usuário não encontrado."
                });
            }
            const senhaCorreta = await bcrypt.compare(
                senha,
                usuario.senha
            );
            if (!senhaCorreta) {
                return res.status(401).json({
                    message: "Senha incorreta."
                });
            }
            const token = jwt.sign(
                {
                    id: usuario.id
                },
                process.env.JWT_SECRET as string,
                {
                    expiresIn: "7d"
                }
            );
            return res.json({
                token,
                usuario: {
                    id: usuario.id,
                    nome: usuario.nome,
                    email: usuario.email
                }
            });
        } catch {
            return res.status(500).json({
                message: "Erro interno."
            });
        }
    }
}