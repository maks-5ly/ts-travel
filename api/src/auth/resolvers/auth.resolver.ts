import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserAndAuthTokens } from '@/auth/type/user-tokens.type';
import { AuthService } from '@/auth/service';
import { LoginGuard } from '@/auth/guard';
import { AuthLoginInput } from '@/auth/dto';
import { ContextAuthUser } from '@/auth/decorators';
import { User } from '@/user/entities';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @LoginGuard()
  @Mutation(() => UserAndAuthTokens)
  async login(
    @Args('loginInput') _: AuthLoginInput,
    @ContextAuthUser() user: User,
  ): Promise<UserAndAuthTokens> {
    return {
      user,
      accessToken: await this.authService.createAccessTokenForUser(user),
    };
  }
}
