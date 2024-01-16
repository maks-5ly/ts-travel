import { GraphQLScalarType } from 'graphql/type';
import { isUUID } from 'class-validator';
import { ValueNode } from 'graphql/language';

function validate(uuid: unknown): string | never {
  if (typeof uuid !== 'string' || !isUUID(uuid)) {
    throw new Error('invalid uuid');
  }

  return uuid;
}

export const CustomUuidScalar = new GraphQLScalarType<string>({
  name: 'UUID',
  description: 'UUID',
  serialize: (value) => validate(value),
  parseValue: (value) => validate(value),
  parseLiteral: (ast: ValueNode) => validate((ast as any)?.value),
});
