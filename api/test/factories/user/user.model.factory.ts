import { AppModule } from '@/app.module';
import { Test } from '@nestjs/testing';
import { CreateUserInput } from '@/user/dto';
import { UserService } from '@/user/services';

export async function userModelFactory(createUserInput: CreateUserInput) {
  const module = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = module.createNestApplication();

  await app.init();
  const userService = app.get<UserService>(UserService);

  const user = userService.create(createUserInput);

  await app.close();
  return user;
}
