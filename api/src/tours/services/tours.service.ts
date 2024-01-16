import { Injectable } from '@nestjs/common';
import { CreateTourInput } from '../dto/create-tour.input';
import { Travel } from '@/travel/entities/travel.entity';
import { Repository } from 'typeorm';
import { Tour } from '@/tours/entities/tour.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HelperDateService } from '@/utils/helper/service';
import { PaginationService } from '@/utils/pagination/services/pagination.service';
import { ListToursInput } from '@/tours/dto/list.tours.input';
import { IPaginatedType } from '@/utils/pagination/type';

@Injectable()
export class ToursService {
  constructor(
    @InjectRepository(Tour)
    private readonly toursRepository: Repository<Tour>,
    private readonly helperDateService: HelperDateService,
    private readonly paginationService: PaginationService,
  ) {}

  create({ price, endingDate, startingDate }: CreateTourInput, travel: Travel) {
    const tour = this.toursRepository.create({
      price: price * 100,
      endingDate,
      startingDate,
      // todo: add CODE to tour and use code
      name: `${travel.id}_${this.helperDateService.format(startingDate)}`,
      travel,
    });
    return this.toursRepository.save(tour);
  }

  async remove(id: string) {
    const tour = await this.toursRepository.findOneOrFail({
      where: { id },
    });
    return this.toursRepository.remove(tour);
  }

  public async getPaginatedToursByTravelIds(
    travelIds: readonly string[],
    listTourInput: ListToursInput,
  ) {
    const queryBuilder = this.toursRepository
      .createQueryBuilder('tour')
      .where('travel_id IN (:...travelIds)', { travelIds });

    return this.paginationService.getPaginatedData({
      queryBuilder,
      options: listTourInput,
    });
  }

  getListQueryBuilder() {
    return this.toursRepository.createQueryBuilder('tour');
  }

  public async getStudentsFriendsByBatch(
    travelIds: string[],
    listTourInput: ListToursInput,
  ): Promise<IPaginatedType<Tour>[]> {
    const tours = await this.getPaginatedToursByTravelIds(
      travelIds,
      listTourInput,
    );
    return this._mapResultToIds(travelIds, tours);
  }

  // TODO: move to DataLoader service
  private _mapResultToIds(travelIds: string[], tours: IPaginatedType<Tour>) {
    return travelIds.map((travelId) => ({
      pagination: tours.pagination,
      data: tours.data.filter((tour: Tour) => tour.travelId === travelId) || [],
    }));
  }
}
