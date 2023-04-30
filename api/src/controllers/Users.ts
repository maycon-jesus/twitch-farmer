import {ControllerBase} from '../base/Controller';
import {v4} from 'uuid';
import bcrypt from 'bcrypt';
import {ErrorMaker} from '../libs/ErrorMaker';

export interface IUser {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
}

export class UsersController extends ControllerBase {
    async create(user: Pick<IUser, 'firstName' | 'lastName' | 'email' | 'password'>) {
        const userWithEmailExists = await this.dd.database.db('users').where({email: user.email}).first<IUser>();
        if (userWithEmailExists)
            throw new ErrorMaker({
                type: 'unprocessable_entity',
                errors: [
                    {
                        message: 'Já existe um usuário com este email!',
                    },
                ],
            });

        const id = v4();
        const role = user.email === process.env.ADMIN_EMAIL ? 'admin' : 'user';
        await this.dd.database
            .db('users')
            .insert({
                ...user,
                id,
                role,
                password: bcrypt.hashSync(user.password, 12),
            })
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

        return {id};
    }

    async findOne(userId: string): Promise<IUser> {
        const user = await this.dd.database.db('users').where({id: userId}).first();
        if (!user)
            throw new ErrorMaker({
                type: 'not_found',
                errors: [{message: 'Usuário não encontrado'}],
            });
        return user;
    }
}
