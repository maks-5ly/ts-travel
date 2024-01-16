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
import { UpdateTourInput } from '@/tours/dto/update-tour.input';

@Injectable()
export class ToursService {
  constructor(
    @InjectRepository(Tour)
    private readonly toursRepository: Repository<Tour>,
    private readonly helperDateService: HelperDateService,
    private readonly paginationService: PaginationService,
  ) {}

  formatPrice(price: number) {
    // todo: move multiplier to Config
    return price ? price * 100 : price;
  }

  create({ price, endingDate, startingDate }: CreateTourInput, travel: Travel) {
    const tour = this.toursRepository.create({
      price: this.formatPrice(price),
      endingDate,
      startingDate,
      // todo: add CODE to tour and use code
      name: `${travel.id}_${this.helperDateService.format(startingDate)}`,
      travel,
    });
    return this.toursRepository.save(tour);
  }

  async update({ id, price, ...rest }: UpdateTourInput) {
    const tour = await this.toursRepository.findOneOrFail({
      where: {
        id,
      },
    });

    Object.assign(tour, {
      ...rest,
      ...(price && { price: this.formatPrice(price) }),
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

  /**
   * TODO: move to DataLoader service as it's generic function
   *       which should be used in another dataloaders
   */
  private _mapResultToIds(travelIds: string[], tours: IPaginatedType<Tour>) {
    return travelIds.map((travelId) => ({
      pagination: tours.pagination,
      data: tours.data.filter((tour: Tour) => tour.travelId === travelId) || [],
    }));
  }
}
