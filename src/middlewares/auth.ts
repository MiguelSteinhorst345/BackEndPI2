// auth.ts serve para informar o token para o Thunder Client

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function auth(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                message: "Token não informado."
            });
        }

        if (!authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Formato do token inválido."
            });
        }

        const token = authHeader
            .replace("Bearer ", "")
            .trim();

        if (!token) {
            return res.status(401).json({
                message: "Token não informado."
            });
        }

        const secret = process.env.JWT_SECRET;

        if (!secret) {
            console.error(
                "JWT_SECRET não configurado no arquivo .env"
            );

            return res.status(500).json({
                message: "Erro interno de configuração."
            });
        }

        const decoded = jwt.verify(
            token,
            secret
        );

        (req as any).user = decoded;

        return next();

    } catch (error) {

        console.error(
            "Erro na autenticação:",
            error instanceof Error
                ? error.message
                : error
        );

        return res.status(401).json({
            message: "Token inválido ou expirado."
        });
    }
}
