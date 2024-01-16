import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { IsDate, IsNumber, IsUUID } from 'class-validator';
import { IsDateAfter } from '@/utils/helper/validators/is-date-after.validation';

@InputType()
export class CreateTourInput {
  @Field(() => Date, { description: 'Starting date of the tour' })
  @IsDate()
  startingDate: Date;

  @Field(() => Date, { description: 'Ending date of the tour' })
  @IsDateAfter('startingDate')
  @IsDate()
  endingDate: Date;

  @Field(() => Int, { description: 'Price of the tour in cents' })
  @IsNumber()
  price: number;

  @Field(() => ID, { description: 'ID of the associated travel' })
  @IsUUID()
  travelId: string;
}
