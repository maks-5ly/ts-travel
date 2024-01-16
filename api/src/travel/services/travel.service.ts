import { Injectable } from '@nestjs/common';
import { CreateTravelInput } from '../dto/create-travel.input';
import { UpdateTravelInput } from '../dto/update-travel.input';
import { IPaginatedType } from '@/utils/pagination/type';
import { Travel } from '../entities/travel.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationService } from '@/utils/pagination/services/pagination.service';
import { ListTravelInput } from '@/travel/dto/list-travel.input';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';

@Injectable()
export class TravelService {
  constructor(
    @InjectRepository(Travel)
    private readonly travelsRepository: Repository<Travel>,
    private readonly paginationService: PaginationService,
  ) {}

  create(createTravelInput: CreateTravelInput) {
    return this.travelsRepository.save(
      this.travelsRepository.create(createTravelInput),
    );
  }

  findAll(
    listTravelInput: ListTravelInput,
    isAdmin = false,
  ): Promise<IPaginatedType<Travel>> {
    const qb = this.getListQueryBuilder('travel');

    if (!isAdmin) {
      qb.andWhere('travel.isPublic = true');
    }

    return this.paginationService.getPaginatedData({
      queryBuilder: qb,
      options: listTravelInput,
    });
  }

  findOne(options: FindOneOptions<Travel>) {
    return this.travelsRepository.findOne(options);
  }

  findById(id: string) {
    return this.travelsRepository.findOne({ where: { id } });
  }

  async update(id: string, updateTravelInput: Partial<UpdateTravelInput>) {
    const travel = await this.travelsRepository.findOneOrFail({
      where: { id },
    });
    Object.assign(travel, updateTravelInput);

    return this.travelsRepository.save(travel);
  }

  async remove(id: string) {
    const travel = await this.travelsRepository.findOneOrFail({
      where: { id },
    });

    return this.travelsRepository.remove(travel);
  }

  private getListQueryBuilder(alias: string) {
    return this.travelsRepository.createQueryBuilder(alias);
  }
}
