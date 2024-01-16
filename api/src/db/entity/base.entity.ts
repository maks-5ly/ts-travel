import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, ID, InterfaceType } from '@nestjs/graphql';

@InterfaceType()
export abstract class BaseEntity<T> {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => Date)
  @DeleteDateColumn()
  deletedAt: Date;

  constructor(props: Partial<T>) {
    Object.assign(this, props);
  }
}
