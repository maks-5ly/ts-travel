import { Column, Entity, Index, OneToMany } from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Moods } from '@/travel/types/moods.type';
import { BaseEntity } from '@/db/entity';
import { Tour } from '@/tours/entities/tour.entity';

@ObjectType()
@Entity()
export class Travel extends BaseEntity<Travel> {
  @Field()
  @Column()
  @Index({ unique: true })
  slug: string;

  @Field()
  @Column({
    length: 255,
  })
  @Index({ unique: true })
  name: string;

  @Field()
  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @Field(() => Int)
  @Column()
  numberOfDays: number;

  @Field(() => Boolean)
  @Column({
    type: 'boolean',
    default: false,
  })
  isPublic: boolean;

  @Field(() => Moods)
  @Column({ type: 'json' })
  moods: Moods;

  @Field(() => Tour)
  @OneToMany(() => Tour, (tour) => tour.travel)
  tours: Tour[];

  @Field(() => Int)
  get numberOfNights(): number {
    return this.numberOfDays - 1;
  }
}
