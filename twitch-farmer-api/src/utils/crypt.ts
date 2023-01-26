import * as bcrypt from 'bcrypt';

export function hashPassword(password: string) {
  return bcrypt.hashSync(password, 14);
}

export function comparePassword(password: string, passwordHash: string) {
  return bcrypt.compareSync(password, passwordHash);
}
