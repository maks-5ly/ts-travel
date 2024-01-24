import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from '@/db/entity';
import { Travel } from '@/travel/entities/travel.entity';

@ObjectType()
@Entity()
export class Tour extends BaseEntity<Tour> {
  @Field(() => String, { description: 'Name of the tour' })
  @Column({ unique: true })
  name: string;

  @Field(() => Date, { description: 'Starting date of the tour' })
  @Column('date')
  startingDate: Date;

  @Field(() => Date, { description: 'Ending date of the tour' })
  @Column('date')
  endingDate: Date;

  @Field(() => Int, { description: 'Price of the tour' })
  @Column({
    type: 'int',
    unsigned: true,
  })
  price: number;

  @Field(() => Travel)
  @ManyToOne(() => Travel, (travel) => travel.tours, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  @JoinColumn()
  travel: Travel;

  @Column('uuid', { name: 'travel_id' })
  travelId: string;

  /**
   *  @comment
   *  i moved it from hook because there was no requirement how this values should be used across the app
   *  so I decided that for some calculations/comparisons, etc. it should be in cents, and last 2 digits
   *  are cut off when it's returned to the client
   */
  // @BeforeInsert()
  // @BeforeUpdate()
  // setDbPrice() {
  //   this.price = this.price * 100;
  // }
  //
  // @AfterLoad()
  // setPrice() {
  //   this.price = this.price / 100;
  // }
}
