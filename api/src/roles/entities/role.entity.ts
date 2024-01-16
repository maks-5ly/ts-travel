import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from '@/db/entity';
import { Column, Entity, Index } from 'typeorm';
import { RoleEnum } from '@/roles/type/roles.interface';

@ObjectType()
@Entity()
export class Role extends BaseEntity<Role> {
  @Field(() => RoleEnum)
  @Column({
    unique: true,
    length: 64,
  })
  @Index()
  name: RoleEnum;
}
