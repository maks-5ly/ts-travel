import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';

@InputType('AuthLoginInput', {
  description: 'Login Credentials',
})
export class AuthLoginInput {
  @Field(() => String, { description: 'Your Email' })
  @IsNotEmpty()
  @IsEmail()
  @Expose()
  email: string;

  @Field(() => String, { description: 'Your Password' })
  @IsNotEmpty()
  @Expose()
  password: string;
}
