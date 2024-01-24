import { CreateTravelInput } from '@/travel/dto/create-travel.input';
import { faker } from '@faker-js/faker';
import { isDefined } from 'class-validator';

export function createUserInputDtoStub(
  createTravelInput?: CreateTravelInput,
): CreateTravelInput {
  return {
    name: isDefined(createTravelInput?.name)
      ? createTravelInput?.name
      : faker.string.uuid(),
    description: isDefined(createTravelInput?.description)
      ? createTravelInput?.description
      : faker.lorem.word(12),
    numberOfDays: isDefined(createTravelInput?.numberOfDays)
      ? createTravelInput?.numberOfDays
      : faker.number.int(20),
    isPublic: isDefined(createTravelInput?.isPublic)
      ? createTravelInput?.isPublic
      : false,
    moods: {
      culture: isDefined(createTravelInput?.moods?.culture)
        ? createTravelInput?.moods?.culture
        : faker.number.int(100),
      history: isDefined(createTravelInput?.moods?.history)
        ? createTravelInput?.moods?.history
        : faker.number.int(100),
      party: isDefined(createTravelInput?.moods?.party)
        ? createTravelInput?.moods?.party
        : faker.number.int(100),
      nature: isDefined(createTravelInput?.moods?.nature)
        ? createTravelInput?.moods?.nature
        : faker.number.int(100),
      relax: isDefined(createTravelInput?.moods?.relax)
        ? createTravelInput?.moods?.relax
        : faker.number.int(100),
    },
  };
}
