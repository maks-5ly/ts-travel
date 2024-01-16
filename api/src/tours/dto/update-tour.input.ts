import { CreateTourInput } from './create-tour.input';
import { Field, ID, InputType, OmitType, PartialType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class UpdateTourInput extends PartialType(
  OmitType(CreateTourInput, ['travelId'] as const),
) {
  @Field(() => ID)
  @IsUUID()
  id: string;
}
