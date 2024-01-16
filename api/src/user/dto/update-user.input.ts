import { Field, ID, InputType, PartialType, PickType } from '@nestjs/graphql';
import { CreateUserInput } from '@/user/dto/create-user.input';
import { IsUUID } from 'class-validator';

@InputType()
export class UpdateUserInput extends PartialType(
  PickType(CreateUserInput, ['roles'] as const),
) {
  @Field(() => ID, {
    description: 'Unique identifier of the user',
  })
  @IsUUID()
  id: string;
}
