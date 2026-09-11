import { Request, Response } from "express";
import { SubjectModel } from "../models/Subject";

export class SubjectController {
    static async list(req: Request,res: Response){
        const user=(req as any).user.id;
        const materias=await SubjectModel.getAll(user);
        res.json(materias);
    }
    static async create(req:Request,res:Response){
        const usuario=(req as any).user.id;
        const{
            nome,
            descricao,
            cor
        }=req.body;
        await SubjectModel.create({
            usuario_id:usuario,
            nome,
            descricao,
            cor
        });
        res.status(201).json({
            message:"Matéria criada com sucesso."
        });
    }
    static async update(req:Request,res:Response){
        const{id}=req.params;
        await SubjectModel.update(Number(id),req.body);
        res.json({
            message:"Matéria atualizada."
        });
    }
    static async delete(req:Request,res:Response){
        const{id}=req.params;
        await SubjectModel.delete(Number(id));
        res.json({
            message:"Matéria removida."
        });
    }
}