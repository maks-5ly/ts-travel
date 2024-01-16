import { PaginationArgs } from '@/utils/pagination/dto';
import { Travel } from '@/travel/entities/travel.entity';
import { ArgsType } from '@nestjs/graphql';

@ArgsType()
export class ListTravelInput extends PaginationArgs<Travel> {}
