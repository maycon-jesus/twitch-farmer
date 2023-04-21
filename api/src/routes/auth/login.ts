import { RouteBase } from '../../base/Route';
import { Request, Response } from 'express';
import { z } from 'zod';
import { ErrorToResponse } from '../../libs/ErrorMaker';

export class AuthLoginRoute extends RouteBase {
    constructor() {
        super({
            path: '/login',
        });
    }

    private bodyValidator = z.object({
        email: z
            .string({
                required_error: 'O email é um campo obrigatório',
            })
            .email('O email é um campo obrigatório'),
        password: z
            .string({
                required_error: 'A senha é um campo obrigatório',
            })
            .min(8, 'O mínimo de caracteres para a senha é 8')
            .max(50, 'O máximo de caracteres para a senha é 50'),
    });

    run(): void {
        this.router.post('/', async (req, res) => {
            try {
                const body = this.bodyValidator.safeParse(req.body);
                if (!body.success)
                    return res.status(400).json({ errorType: 'form_validation', errors: body.error.errors });

                const loginData = await this.dd.auth.login({
                    email: body.data.email,
                    password: body.data.password,
                });

                res.json({ token: loginData.token });
            } catch (err: any) {
                console.log(err);
                const e = ErrorToResponse(err);
                res.status(e.status).json(e.error);
            }
        });
    }
}
