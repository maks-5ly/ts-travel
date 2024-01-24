import request from 'supertest-graphql';
import gql from 'graphql-tag';
import { IntegrationTestManager } from '../../integratoin-test-manager';
import { createUserInputDtoStub } from '../../../factories/auth/dto/create-user-input.dto.stub';
import { Travel } from '@/travel/entities/travel.entity';
import { UserService } from '@/user/services';
import { faker } from '@faker-js/faker';
import { RoleEnum } from '@/roles/type';
import { TravelService } from '@/travel/services';

describe('TravelResolver', () => {
  let server;

  beforeAll(() => {
    server = IntegrationTestManager.getHttpServer();
  });

  describe('createTravel', () => {
    const mutation = gql`
      mutation createTravel($createTravelInput: CreateTravelInput!) {
        createTravel(createTravelInput: $createTravelInput) {
          id
          name
          description
          numberOfDays
          isPublic
          moods {
            culture
            history
            party
            nature
            relax
          }
        }
      }
    `;
    it('should throw Unauthorized error for unauthorized users', async () => {
      const createTravelInput = createUserInputDtoStub();

      const response = await request<{ createTravel: Travel }>(server)
        .mutate(mutation)
        .variables({ createTravelInput });

      const error = response.errors[0];
      expect(response.data).toBeNull();
      expect(error.message).toBe('Unauthorized Exception');
    });

    it('should throw Forbidden resource for non-admin users', async () => {
      const userService =
        IntegrationTestManager.getService<UserService>(UserService);

      const user = await userService.create({
        email: faker.internet.email(),
        password: '123456',
        roles: [RoleEnum.EDITOR],
      });

      const token = await IntegrationTestManager.getAuthorizedUserToken(user);

      const createTravelInput = createUserInputDtoStub();

      const response = await request<{ createTravel: Travel }>(server)
        .set('Authorization', `Bearer ${token}`)
        .mutate(mutation)
        .variables({ createTravelInput });

      const error = response.errors[0];
      expect(response.data).toBeNull();
      expect(error.message).toBe('Forbidden resource');
    });

    it('should create travel', async () => {
      const token = await IntegrationTestManager.getAuthorizedUserToken();

      const createTravelInput = createUserInputDtoStub();
      const travelService =
        IntegrationTestManager.getService<TravelService>(TravelService);

      const response = await request<{ createTravel: Travel }>(server)
        .set('Authorization', `Bearer ${token}`)
        .mutate(mutation)
        .variables({ createTravelInput });

      const travel = response.data.createTravel;
      expect(travel).toMatchObject(expect.objectContaining(createTravelInput));

      const dbTravel = await travelService.findById(travel.id);
      expect(dbTravel).toMatchObject(travel);
    });
  });
});
