import { Injectable } from '@nestjs/common';
import DataLoader from 'dataloader';
import { ToursService } from '@/tours/services';
import { IDataLoaders } from '@/dataloader/types';
import { Tour } from '@/tours/entities/tour.entity';
import { ListToursInput } from '@/tours/dto/list.tours.input';
import { IPaginatedType } from '@/utils/pagination/type';

@Injectable()
export class DataLoaderService {
  constructor(private readonly toursService: ToursService) {}

  getLoaders(): IDataLoaders {
    const toursLoader = (listTourInput: ListToursInput) =>
      this.createToursLoader(listTourInput);
    return {
      toursLoader,
    };
  }

  private createToursLoader(listTourInput: ListToursInput) {
    return new DataLoader<string, IPaginatedType<Tour>>(
      async (keys: string[]) =>
        await this.toursService.getStudentsFriendsByBatch(keys, listTourInput),
    );
  }
}
