import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, JoinTable, ManyToMany } from 'typeorm';
import { BaseEntity } from '@/db/entity';
import { Role } from '@/roles/entities';

@ObjectType()
@Entity()
export class User extends BaseEntity<User> {
  @Field(() => String)
  @Index()
  @Column({
    unique: true,
    length: 64,
  })
  email!: string;

  @Column({
    unique: true,
    length: 72,
  })
  password!: string;

  @Field(() => [Role], { nullable: true })
  @ManyToMany(() => Role, { cascade: true })
  @JoinTable({
    name: 'user_roles',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
  })
  roles: Role[];
}
