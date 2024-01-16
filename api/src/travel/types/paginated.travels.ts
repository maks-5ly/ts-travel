import { ObjectType } from '@nestjs/graphql';
import { Travel } from '@/travel/entities/travel.entity';
import { Paginated } from '@/utils/pagination/type';

@ObjectType()
export class PaginatedTravels extends Paginated<Travel>(Travel) {}
