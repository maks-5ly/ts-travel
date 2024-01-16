import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsEnum, IsNotEmpty, MaxLength } from 'class-validator';
import { IsPasswordStrong } from '@/utils/helper/validators';
import { RoleEnum } from '@/roles/type/roles.interface';

@InputType()
export class CreateUserInput {
  @Field(() => String, { description: 'Email of the user' })
  @IsEmail()
  email: string;

  @Field(() => String, { description: 'Password of the user' })
  @IsPasswordStrong()
  @MaxLength(30)
  @IsNotEmpty()
  password: string;

  @Field(() => [RoleEnum], {
    description: 'Roles assigned to the user',
    nullable: true,
  })
  @IsEnum(RoleEnum, { each: true })
  roles?: RoleEnum[];
}
