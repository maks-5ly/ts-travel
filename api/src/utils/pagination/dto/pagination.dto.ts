import { ArgsType, Field, InputType, Int } from '@nestjs/graphql';
import {
  IPaginationOptions,
  IPaginationSortOrder,
  SortOrder,
} from '@/utils/pagination/type';

@InputType('PaginationSorting')
export class PaginationSorting<T> implements IPaginationSortOrder<T> {
  @Field(() => String, { nullable: true })
  sortByKey: keyof T;

  @Field(() => SortOrder, { nullable: true })
  sortDirection: SortOrder;
}

@ArgsType()
export class PaginationArgs<T> implements IPaginationOptions {
  @Field(() => Int, { defaultValue: 25 })
  take?: number;

  @Field(() => Int, { defaultValue: 0 })
  skip?: number;

  @Field(() => Int, { defaultValue: 1 })
  page?: number;

  @Field(() => [PaginationSorting], { nullable: true })
  order?: PaginationSorting<T>[];
}
