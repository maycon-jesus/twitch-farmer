import { ControllerBase } from '../base/Controller';
import { ErrorMaker } from '../libs/ErrorMaker';
import jsonwebtoken from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export interface IJWTPayload {
    userId: string;
    roleId: string;
    permissions: string[];
}

export class AuthController extends ControllerBase {
    constructor() {
        super();
    }

    async login(data: { email: string; password: string }) {
        const user = await this.dd.database
            .db('users')
            .select('password', 'email', 'id', 'role')
            .where({ email: data.email })
            .first()
            .catch(() => {
                throw new ErrorMaker({
                    errors: [
                        {
                            message: 'Ocorreu um erro no banco de dados!',
                        },
                    ],
                    type: 'database',
                });
            });

        if (!user)
            throw new ErrorMaker({
                errors: [
                    {
                        message: 'Usuário ou senha incorreto!',
                    },
                ],
                type: 'forbidden',
            });

        // Validar senha
        const passValid = bcrypt.compareSync(data.password, user.password);
        if (!passValid)
            throw new ErrorMaker({
                errors: [
                    {
                        message: 'Usuário ou senha incorreto!',
                    },
                ],
                type: 'forbidden',
            });

        // Gerar JWT
        const permissions = await this.dd.roles.getRolePermissions(user.role);
        const token = await this.generateJWT({
            permissions,
            roleId: user.role,
            userId: user.id,
        });

        return {
            token,
        };
    }

    async generateJWT(payload: IJWTPayload) {
        return jsonwebtoken.sign(payload, process.env.JWT_SECRET!, {
            audience: 'twitch.mayconjesus.dev',
            expiresIn: '365d',
            issuer: 'Twitch Farmer BOT',
        });
    }

    async validateToken(token: string): Promise<IJWTPayload> {
        try {
            return jsonwebtoken.verify(token, process.env.JWT_SECRET!) as IJWTPayload;
        } catch {
            throw new ErrorMaker({
                type: 'unauthorized',
                errors: [
                    {
                        message: 'Acesso expirado. Faça login novamente!',
                    },
                ],
            });
        }
    }
}
