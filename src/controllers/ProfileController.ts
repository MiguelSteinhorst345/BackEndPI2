/*
import { Request, Response } from "express";
import { ProfileService} from "../services/ProfileService";


export class ProfileController {

    static async getProfile(
        req: Request,
        res: Response
    ) {

        try {

            const usuarioId =
                (req as any).user.id;


            const usuario =
                await ProfileService.getProfile(
                    usuarioId
                );


            if (!usuario) {

                return res.status(404).json({
                    message:
                        "Usuário não encontrado."
                });

            }


            return res.status(200).json(
                usuario
            );

        } catch (error) {

            console.error(error);

            return res.status(500).json({
                message:
                    "Erro ao buscar perfil."
            });

        }
    }

    static async updateProfile(
        req: Request,
        res: Response
    ) {

        try {

            const usuarioId =
                (req as any).user.id;


            const {
                nome,
                email,
                foto_perfil,
                modo_escuro
            } = req.body;


            if (
                nome === undefined &&
                email === undefined &&
                foto_perfil === undefined &&
                modo_escuro === undefined
            ) {

                return res.status(400).json({
                    message:
                        "Informe pelo menos um dado para atualizar."
                });

            }


            if (
                modo_escuro !== undefined &&
                typeof modo_escuro !== "boolean"
            ) {

                return res.status(400).json({
                    message:
                        "modo_escuro deve ser true ou false."
                });

            }


            const usuario =
                await ProfileService.updateProfile(
                    usuarioId,
                    nome,
                    email,
                    foto_perfil,
                    modo_escuro
                );


            return res.status(200).json({
                message:
                    "Perfil atualizado com sucesso.",
                usuario
            });

        } catch (error: any) {

            console.error(error);

            if (error.code === "ER_DUP_ENTRY") {

                return res.status(400).json({
                    message:
                        "Este e-mail já está sendo utilizado."
                });

            }


            return res.status(500).json({
                message:
                    "Erro ao atualizar perfil."
            });

        }
    }

    static async updateDarkMode(
        req: Request,
        res: Response
    ) {

        try {

            const usuarioId =
                (req as any).user.id;


            const {
                modo_escuro
            } = req.body;


            if (
                typeof modo_escuro !== "boolean"
            ) {

                return res.status(400).json({
                    message:
                        "modo_escuro deve ser true ou false."
                });

            }


            const usuario =
                await ProfileService.updateDarkMode(
                    usuarioId,
                    modo_escuro
                );


            return res.status(200).json({
                message:
                    "Modo escuro atualizado com sucesso.",
                usuario
            });

        } catch (error) {

            console.error(error);

            return res.status(500).json({
                message:
                    "Erro ao atualizar modo escuro."
            });

        }
    }

}

*/