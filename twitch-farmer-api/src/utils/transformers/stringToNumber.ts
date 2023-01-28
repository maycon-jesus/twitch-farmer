import { BadRequestException } from '@nestjs/common';

export function stringToNumberTransformer(paramName: string, value: string) {
  const valueNumber = Number(value);
  if (Number.isNaN(valueNumber))
    throw new BadRequestException(`${paramName} não é um número válido`);
  if (!Number.isInteger(valueNumber))
    throw new BadRequestException(`${paramName} não é um número inteiro`);
  return valueNumber;
}
