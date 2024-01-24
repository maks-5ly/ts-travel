import { faker } from '@faker-js/faker';
import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Travel } from '@/travel/entities/travel.entity';
import { Tour } from '@/tours/entities/tour.entity';
const slugify = async (text: string) =>
  // cspell:disable-next-line
  (await import('@sindresorhus/slugify')).default(text);

@Injectable()
export default class TravelSeeds implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const travelRepository = dataSource.getRepository(Travel);
    const toursRepository = dataSource.getRepository(Tour);

    const travels = await Promise.all(
      Array.from({ length: 10 }).map(async () => {
        const createdTours = Array.from({
          length: faker.number.int({ min: 3, max: 7 }),
        }).map(() => {
          const startingDate = faker.helpers.arrayElement([
            faker.date.recent(),
            ...Array.from({ length: faker.number.int({ min: 3, max: 7 }) }).map(
              () => faker.date.future(),
            ),
          ]);

          return toursRepository.create({
            name: faker.lorem.words(3),
            startingDate: startingDate,
            endingDate: faker.date.future({ refDate: startingDate }),
            price: faker.number.int({ min: 400, max: 5000 }),
          });
        });

        const name = faker.word.words(3);
        return travelRepository.create({
          name,
          slug: await slugify(name),
          description: faker.lorem.paragraph(),
          isPublic: faker.datatype.boolean(),
          numberOfDays: faker.number.int({ min: 3, max: 21 }),
          moods: {
            culture: faker.number.int(100),
            history: faker.number.int(100),
            party: faker.number.int(100),
            nature: faker.number.int(100),
            relax: faker.number.int(100),
          },
          tours: createdTours,
        });
      }),
    );

    await travelRepository.save(travels);
  }
}
