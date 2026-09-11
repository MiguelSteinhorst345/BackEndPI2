// auth.ts serve para informar o token para o Thunder Client

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function auth(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({
            message: "Token não informado."
        });
    }
    const  token = authHeader.replace("Bearer", "").trim();
  console.log(token);
  console.log(process.env.JWT_SECRET);
    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        );
        (req as any).user = decoded;
        next();
    } catch {
        return res.status(401).json({
            message: "Token inválido."
        });
    }
}