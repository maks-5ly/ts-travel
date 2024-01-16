import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from '@/user/services';
import { User } from '@/user/entities';
import { CreateUserInput, RemoveUserInput, UpdateUserInput } from '@/user/dto';
import { AuthGuard } from '@/auth/guard';
import { RoleEnum } from '@/roles/type';

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
  findAll() {
    return this.userService.findAll();
  }

  @Query(() => User, { name: 'user' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.userService.findOne(id);
  }

  @Mutation(() => User)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.userService.update(updateUserInput.id, updateUserInput);
  }

  @Mutation(() => User)
  removeUser(@Args('removeUserInput') removeUserInput: RemoveUserInput) {
    return this.userService.remove(removeUserInput.id);
  }
}
