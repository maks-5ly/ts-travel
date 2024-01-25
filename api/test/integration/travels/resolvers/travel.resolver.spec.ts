import { faker } from '@faker-js/faker';
import gql from 'graphql-tag';
import request from 'supertest-graphql';

import { IntegrationTestManager } from '../../integratoin-test-manager';
import { Travel } from '@/travel/entities/travel.entity';
import { UserService } from '@/user/services';
import { RoleEnum } from '@/roles/type';
import { TravelService } from '@/travel/services';
import { PaginatedTravels } from '@/travel/types';
import { ListTravelInput } from '@/travel/dto/list-travel.input';

import { createTravelInputDtoStub } from '../../../factories/travel/dto/create-travel-input-dto.stub';
import { travelModelFactory } from '../../../factories/travel/travel.model.factory';

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
      const createTravelInput = createTravelInputDtoStub();

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

      const createTravelInput = createTravelInputDtoStub();

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

      const createTravelInput = createTravelInputDtoStub();
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

  describe('findAll', () => {
    const query = gql`
      query getPaginatedTravels($take: Int!, $skip: Int!) {
        travels(take: $take, skip: $skip) {
          data {
            id
            description
            isPublic
            moods {
              culture
              history
              nature
              party
              relax
            }
            name
            numberOfDays
            numberOfNights
            createdAt
            tours(take: 4, skip: 0) {
              data {
                id
                name
              }
            }
          }
          pagination {
            page
            perPage
            totalPage
            total
          }
        }
      }
    `;

    it('should return a list of travels', async () => {
      const authToken = await IntegrationTestManager.getAuthorizedUserToken();

      const travels = await Promise.all([
        travelModelFactory(),
        travelModelFactory(),
        travelModelFactory(),
        travelModelFactory(),
        travelModelFactory(),
        travelModelFactory(),
      ]);

      const listTravelInput: ListTravelInput = {
        take: 3,
        skip: 0,
      };

      const response = await request<{ travels: PaginatedTravels }>(server)
        .set('Authorization', `Bearer ${authToken}`)
        .query(query)
        .variables({ ...listTravelInput });

      expect(response.data.travels.data).toHaveLength(listTravelInput.take);
      expect(response.data.travels.pagination.page).toBe(1);
      expect(response.data.travels.pagination.perPage).toBe(
        listTravelInput.take,
      );
      expect(response.data.travels.pagination.totalPage).toBe(
        travels.length / listTravelInput.take,
      );
      expect(response.data.travels.pagination.total).toBe(travels.length);
    });

    it('should return a list of public travels for non authorized users', async () => {
      const travels = await Promise.all([
        travelModelFactory({ travelInput: { isPublic: true } }),
        travelModelFactory({ travelInput: { isPublic: true } }),
        travelModelFactory({ travelInput: { isPublic: true } }),
        travelModelFactory({ travelInput: { isPublic: false } }),
        travelModelFactory({ travelInput: { isPublic: false } }),
        travelModelFactory({ travelInput: { isPublic: false } }),
      ]);

      const listTravelInput: ListTravelInput = {
        take: travels.length,
        skip: 0,
      };

      const response = await request<{ travels: PaginatedTravels }>(server)
        .query(query)
        .variables({ ...listTravelInput });

      expect(response.data.travels.data).toHaveLength(3);
      expect(response.data.travels.pagination.page).toBe(1);
      expect(response.data.travels.pagination.perPage).toBe(
        listTravelInput.take,
      );
      expect(response.data.travels.pagination.totalPage).toBe(1);
      expect(response.data.travels.pagination.total).toBe(3);
    });

    it('should return an error for invalid input', async () => {
      const response = await request<{ travels: PaginatedTravels }>(server)
        .query(query)
        .variables({ take: 'hello', skip: 0 });

      const error = response.errors[0];
      expect(error.message).toBe(
        'Variable "$take" got invalid value "hello"; Int cannot represent non-integer value: "hello"',
      );
      expect(error.extensions.code).toBe('BAD_USER_INPUT');
    });
  });
});
