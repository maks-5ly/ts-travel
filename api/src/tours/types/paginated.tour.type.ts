import { Paginated } from '@/utils/pagination/type';
import { ObjectType } from '@nestjs/graphql';
import { Tour } from '@/tours/entities/tour.entity';

@ObjectType()
export class PaginatedTours extends Paginated(Tour) {}
