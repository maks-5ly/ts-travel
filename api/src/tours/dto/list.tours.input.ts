import { ArgsType } from '@nestjs/graphql';
import { PaginationArgs } from '@/utils/pagination/dto';
import { Tour } from '@/tours/entities/tour.entity';

@ArgsType()
export class ListToursInput extends PaginationArgs<Tour> {}
