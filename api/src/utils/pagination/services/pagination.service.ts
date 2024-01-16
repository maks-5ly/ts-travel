import { Injectable } from '@nestjs/common';

import { isNumber } from 'class-validator';
import { SelectQueryBuilder } from 'typeorm';

import { IPaginatedType, IPaginationOptions } from '@/utils/pagination/type';

@Injectable()
export class PaginationService {
  async getPaginatedData<T>({
    queryBuilder,
    options,
  }: {
    queryBuilder: SelectQueryBuilder<T>;
    options: IPaginationOptions;
  }): Promise<IPaginatedType<T>> {
    const totalData = await queryBuilder.clone().getCount();

    if (options?.order?.length) {
      options.order.forEach((order) => {
        queryBuilder.addOrderBy(order.sortByKey as string, order.sortDirection);
      });
    }

    if (
      isNumber(options.take) &&
      (isNumber(options.page) || isNumber(options.skip))
    ) {
      const skip =
        options?.skip || (await this.skip(options.page, options.take));
      queryBuilder.take(options.take).skip(skip);
    }

    const data = await queryBuilder.getMany();

    const totalPage = await this.totalPage(totalData, options.take);

    return {
      data,
      pagination: {
        page: options.page,
        perPage: options.take,
        totalPage,
        total: totalData,
      },
    };
  }

  private async skip(page: number, perPage: number): Promise<number> {
    perPage = Math.min(100, perPage);
    return (page - 1) * perPage;
  }

  private async totalPage(totalData: number, limit: number): Promise<number> {
    return Math.ceil(totalData / limit);
  }
}
