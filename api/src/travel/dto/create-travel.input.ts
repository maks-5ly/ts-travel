import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { MoodsInput } from '@/travel/dto/moods.input';
import { Exclude, Expose } from 'class-transformer'; // Assuming Moods is a type and not an entity

@InputType()
@Exclude()
export class CreateTravelInput {
  @Field(() => String, { description: 'Name of the travel' })
  @IsNotEmpty()
  @Expose()
  name: string;

  @Field(() => String, { description: 'Description of the travel' })
  @IsNotEmpty()
  @Expose()
  description: string;

  @Field(() => Int, { description: 'Number of days of the travel' })
  @IsNotEmpty()
  @Expose()
  numberOfDays: number;

  @Field(() => Boolean, {
    description: 'Public visibility of the travel',
    defaultValue: false,
  })
  @IsNotEmpty()
  @Expose()
  isPublic: boolean;

  @Field(() => MoodsInput, { description: 'Moods associated with the travel' })
  @IsNotEmpty()
  @Expose()
  moods: MoodsInput;
}
