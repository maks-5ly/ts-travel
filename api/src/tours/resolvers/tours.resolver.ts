import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ToursService } from '@/tours/services';
import { Tour } from '../entities/tour.entity';
import { CreateTourInput } from '../dto/create-tour.input';
import { CheckTravel } from '@/tours/guard';
import { Travel } from '@/travel/entities/travel.entity';
import { ContextTravel } from '@/travel/decorator';

@Resolver(() => Tour)
export class ToursResolver {
  constructor(private readonly toursService: ToursService) {}

  @Mutation(() => Tour)
  @CheckTravel()
  createTour(
    @Args('createTourInput') createTourInput: CreateTourInput,
    @ContextTravel() travel: Travel,
  ) {
    return this.toursService.create(createTourInput, travel);
  }

  @Mutation(() => Tour)
  removeTour(@Args('id', { type: () => String }) id: string) {
    return this.toursService.remove(id);
  }
}
