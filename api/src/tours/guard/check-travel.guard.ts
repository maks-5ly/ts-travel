import {
  applyDecorators,
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { CreateTourInput } from '@/tours/dto/create-tour.input';
import { TravelService } from '@/travel/services';
import { IRequestContext } from '@/utils/request/type/request.interface';

@Injectable()
export class CheckTravelGuard implements CanActivate {
  constructor(private readonly travelService: TravelService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const context = GqlExecutionContext.create(ctx);
    const { createTourInput: { travelId } = {} } = context.getArgs<{
      createTourInput: CreateTourInput;
    }>();

    const travel = await this.travelService.findById(travelId);

    if (!travel) {
      throw new NotFoundException({
        message: 'Travel not found',
      });
    }

    context.getContext<IRequestContext>().__travel = travel;

    return true;
  }
}

export function CheckTravel() {
  return applyDecorators(UseGuards(CheckTravelGuard));
}
