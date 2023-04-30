import {RouteBase} from '../../base/Route';
import {z} from 'zod';
import {ErrorMaker, ErrorToResponse} from '../../libs/ErrorMaker';

export class AuthRegisterRoute extends RouteBase {
    private bodyValidator = z.object({
        firstName: z
            .string({
                required_error: 'O primeiro nome é um campo obrigatório',
            })
            .trim(),
        lastName: z
            .string({
                required_error: 'O sobrenome é um campo obrigatório',
            })
            .trim(),
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
        inviteCode: z
            .string({
                required_error: 'O código de convite é um campo obrigatório',
            })
            .trim()
            .uuid('Código inválido'),
    });

    constructor() {
        super({
            path: '/register',
        });
    }

    run(): void {
        this.router.post('/', async (req, res) => {
            try {
                const body = this.bodyValidator.safeParse(req.body);
                if (!body.success)
                    return res.status(400).json({errorType: 'form_validation', errors: body.error.errors});

                const inviteCode = await this.dd.inviteCodes.getInviteByCode(body.data.inviteCode);
                if (inviteCode.used)
                    throw new ErrorMaker({
                        type: 'unauthorized',
                        errors: [
                            {
                                message: 'Esse código de convite ja foi utilizado',
                            },
                        ],
                    });

                const nUser = await this.dd.users.create({
                    email: body.data.email,
                    firstName: body.data.firstName,
                    lastName: body.data.lastName,
                    password: body.data.password,
                });

                await this.dd.inviteCodes.markInviteUsed(body.data.inviteCode, nUser.id);

                res.json({success: true});
            } catch (err: any) {
                const e = ErrorToResponse(err);
                res.status(e.status).json(e.error);
            }
        });
    }
}
