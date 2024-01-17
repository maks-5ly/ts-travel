import {
  Args,
  Int,
  Mutation,
  Resolver,
  ResolveField,
  Parent
} from '@nestjs/graphql';
import { ToursService } from '@/tours/services';
import { Tour } from '../entities/tour.entity';
import { CreateTourInput } from '../dto/create-tour.input';
import { CheckTravel } from '@/tours/guard';
import { Travel } from '@/travel/entities/travel.entity';
import { ContextTravel } from '@/travel/decorator';
import { AuthGuard } from '@/auth/guard';
import { RoleEnum } from '@/roles/type';
import { UpdateTourInput } from '@/tours/dto/update-tour.input';

@Resolver(() => Tour)
export class ToursResolver {
  constructor(private readonly toursService: ToursService) {}

  @Mutation(() => Tour, {
    name: 'createTour',
    description: 'Endpoint for admins/editors which allows to Create tour',
  })
  @AuthGuard({
    role: RoleEnum.EDITOR,
  })
  @CheckTravel()
  createTour(
    @Args('createTourInput') createTourInput: CreateTourInput,
    @ContextTravel() travel: Travel,
  ) {
    return this.toursService.create(createTourInput, travel);
  }

  @Mutation(() => Tour, {
    name: 'updateTour',
    description: 'Endpoint for admins/editors which allows to Update tour',
  })
  @AuthGuard({
    role: RoleEnum.EDITOR,
  })
  updateTour(@Args('updateTourInput') updateTourInput: UpdateTourInput) {
    return this.toursService.update(updateTourInput);
  }

  @AuthGuard({
    role: RoleEnum.EDITOR,
  })
  @Mutation(() => Tour)
  removeTour(@Args('id', { type: () => String }) id: string) {
    return this.toursService.remove(id);
  }

  @ResolveField('price', () => Int)
  price(
    @Parent() tour: Tour
  ) {
    return tour.price ? tour.price / 100 : tour.price;
  }
}
