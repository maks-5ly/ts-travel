import { InputType, PartialType, PickType } from '@nestjs/graphql';
import { UpdateUserInput } from '@/user/dto/update-user.input';

@InputType()
export class RemoveUserInput extends PartialType(
  PickType(UpdateUserInput, ['id'] as const),
) {}
