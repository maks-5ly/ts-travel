import {
  Args,
  Context,
  ID,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { TravelService } from '../services/travel.service';
import { Travel } from '../entities/travel.entity';
import { CreateTravelInput } from '../dto/create-travel.input';
import { UpdateTravelInput } from '../dto/update-travel.input';
import { ListTravelInput } from '@/travel/dto/list-travel.input';
import { PaginatedTravels } from '@/travel/types/paginated.travels';
import { PaginatedTours } from '@/tours/types';
import { ListToursInput } from '@/tours/dto/list.tours.input';
import { Tour } from '@/tours/entities/tour.entity';
import { ToursService } from '@/tours/services/tours.service';
import { IRequestContext } from '@/utils/request/type/request.interface';
import { IPaginatedType } from '@/utils/pagination/type';

@Resolver(() => Travel)
export class TravelResolver {
  constructor(
    private readonly travelService: TravelService,
    // TODO: move to Resolvers module
    private readonly toursService: ToursService,
  ) {}

  @Mutation(() => Travel)
  createTravel(
    @Args('createTravelInput') createTravelInput: CreateTravelInput,
  ) {
    return this.travelService.create(createTravelInput);
  }

  @Query(() => PaginatedTravels, { name: 'travels' })
  findAll(@Args() listTravelInput: ListTravelInput) {
    return this.travelService.findAll(listTravelInput);
  }

  @Query(() => Travel, { name: 'travel' })
  findOne(@Args('slug') slug: string) {
    return this.travelService.findOne({ where: { slug } });
  }

  @Mutation(() => Travel)
  updateTravel(@Args('updateTravelInput') { id, ...input }: UpdateTravelInput) {
    return this.travelService.update(id, input);
  }

  @Mutation(() => Travel)
  removeTravel(@Args('id', { type: () => ID }) id: string) {
    return this.travelService.remove(id);
  }

  @ResolveField('tours', () => PaginatedTours)
  async getTours(
    @Parent() travel: Travel,
    @Args() listToursInput: ListToursInput,
    @Context() { loaders }: IRequestContext,
  ): Promise<IPaginatedType<Tour>> {
    const loader = loaders.toursLoader(listToursInput);
    return loader.load(travel.id);
    // return this.toursService.getPaginatedToursByTravelIds(
    //   [travel.id],
    //   listToursInput,
    // );
  }
}
