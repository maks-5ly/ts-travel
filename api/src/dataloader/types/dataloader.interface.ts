import DataLoader from 'dataloader';
import { Tour } from '@/tours/entities/tour.entity';
import { ListToursInput } from '@/tours/dto/list.tours.input';
import { IPaginatedType } from '@/utils/pagination/type';

export interface IDataLoaders {
  toursLoader: (
    listTourInput: ListToursInput,
  ) => DataLoader<string, IPaginatedType<Tour>>;
}
