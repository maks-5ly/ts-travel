import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '@/user/entities';

@ObjectType()
export class UserAndAuthTokens {
  @Field(() => String, { description: 'access token' })
  accessToken!: string;

  @Field(() => User)
  user!: User;
}
