import { forwardRef, Module } from '@nestjs/common';
import { ToursService } from '@/tours/services';
import { ToursResolver } from '@/tours/resolvers';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tour } from '@/tours/entities/tour.entity';
import { TravelModule } from '@/travel/travel.module';

@Module({
  imports: [TypeOrmModule.forFeature([Tour]), forwardRef(() => TravelModule)],
  providers: [ToursResolver, ToursService],
  exports: [ToursService],
})
export class ToursModule {}
