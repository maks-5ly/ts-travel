import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class MoodsInput {
  @Field(() => Int, { defaultValue: 0 })
  nature: number;

  @Field(() => Int, { defaultValue: 0 })
  relax: number;

  @Field(() => Int, { defaultValue: 0 })
  history: number;

  @Field(() => Int, { defaultValue: 0 })
  culture: number;

  @Field(() => Int, { defaultValue: 0 })
  party: number;
}
