import { forwardRef, Module } from '@nestjs/common';
import { TravelService } from '@/travel/services';
import { TravelResolver } from '@/travel/resolvers';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Travel } from '@/travel/entities/travel.entity';
import { TravelSubscriber } from '@/travel/subscriber/travel.subscriber';
import { ToursModule } from '@/tours/tours.module';

@Module({
  imports: [TypeOrmModule.forFeature([Travel]), forwardRef(() => ToursModule)],
  providers: [TravelResolver, TravelService, TravelSubscriber],
  exports: [TravelService],
})
export class TravelModule {}
