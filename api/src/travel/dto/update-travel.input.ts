import { CreateTravelInput } from './create-travel.input';
import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class UpdateTravelInput extends PartialType(CreateTravelInput) {
  @Field(() => ID)
  @IsUUID()
  id: string;
}
