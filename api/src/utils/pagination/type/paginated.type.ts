import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Type } from '@nestjs/common';

interface IPaginatedMeta {
  page: number;
  perPage: number;
  total: number;
  totalPage: number;
}

export enum SortOrder {
  DESC = 'DESC',
  ASC = 'ASC',
}

export interface IPaginationSortOrder<T> {
  sortByKey: keyof T;
  sortDirection: SortOrder;
}

export interface IPaginationOptions<T = any> {
  take?: number;
  skip?: number;
  page?: number;
  order?: IPaginationSortOrder<T>[];
}

export interface IPaginatedType<T> {
  pagination: IPaginatedMeta;
  data: T[];
}

@ObjectType(`PaginationMeta`)
abstract class PaginationMeta implements IPaginatedMeta {
  @Field(() => Int)
  page: number;

  @Field(() => Int)
  perPage: number;

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  totalPage: number;
}

export function Paginated<T>(classRef: Type<T>): Type<IPaginatedType<T>> {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedType implements IPaginatedType<T> {
    @Field(() => PaginationMeta)
    pagination: PaginationMeta;

    @Field(() => [classRef], { nullable: true })
    data: T[];
  }

  return PaginatedType as Type<IPaginatedType<T>>;
}
