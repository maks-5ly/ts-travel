import { CreateUserInput } from '@/user/dto';
import { UserService } from '@/user/services';
import { IntegrationTestManager } from '../../integration/integratoin-test-manager';

export async function userModelFactory(createUserInput: CreateUserInput) {
  // const module = await Test.createTestingModule({
  //   imports: [AppModule],
  // }).compile();
  //
  // const app = module.createNestApplication({
  //   bodyParser: true,
  //   rawBody: true,
  // });
  //
  // await app.init();

  const userService =
    IntegrationTestManager.getService<UserService>(UserService);

  const user = userService.create(createUserInput);

  return user;
}
