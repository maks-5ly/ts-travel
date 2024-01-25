import { faker } from '@faker-js/faker';
import { TravelService } from '@/travel/services';
import { ToursService } from '@/tours/services';
import { CreateTravelInput } from '@/travel/dto/create-travel.input';
import { createTravelInputDtoStub } from './dto/create-travel-input-dto.stub';
import { IntegrationTestManager } from '../../integration/integratoin-test-manager';

export async function travelModelFactory({
  travelInput,
  toursCount = 2,
}: {
  travelInput?: Partial<CreateTravelInput>;
  toursCount?: number;
} = {}) {
  const travelService =
    IntegrationTestManager.getService<TravelService>(TravelService);
  const tourService =
    IntegrationTestManager.getService<ToursService>(ToursService);

  const travel = await travelService.create(
    createTravelInputDtoStub(travelInput),
  );

  travel.tours = await Promise.all(
    Array.from({
      length: faker.number.int(toursCount),
    }).map(() => {
      const startingDate = faker.helpers.arrayElement([
        faker.date.recent(),
        ...Array.from({ length: faker.number.int({ min: 3, max: 7 }) }).map(
          () => faker.date.future(),
        ),
      ]);

      return tourService.create(
        {
          travelId: travel.id,
          startingDate: startingDate,
          endingDate: faker.date.future({ refDate: startingDate }),
          price: faker.number.int({ min: 400, max: 5000 }),
        },
        travel,
      );
    }),
  );
  return travel;
}
