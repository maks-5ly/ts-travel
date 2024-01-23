import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { UserService } from '@/user/services';
import { User } from '@/user/entities';
import { CreateUserInput, RemoveUserInput, UpdateUserInput } from '@/user/dto';
import { AuthGuard } from '@/auth/guard';
import { RoleEnum } from '@/roles/type';
import { Role } from '@/roles/entities';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.userService.create(createUserInput);
  }

  @AuthGuard({
    role: RoleEnum.ADMIN,
  })
  @Query(() => [User], { name: 'users' })
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @AuthGuard({
    role: RoleEnum.ADMIN,
  })
  @Mutation(() => User)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.userService.update(updateUserInput.id, updateUserInput);
  }

  @AuthGuard({
    role: RoleEnum.ADMIN,
  })
  @Mutation(() => User)
  removeUser(@Args('removeUserInput') removeUserInput: RemoveUserInput) {
    return this.userService.remove(removeUserInput.id);
  }

  @AuthGuard({
    role: RoleEnum.ADMIN,
  })
  @ResolveField('roles', () => [Role])
  roles(@Parent() user: User) {
    return this.userService.getUserRoles(user);
  }
}
