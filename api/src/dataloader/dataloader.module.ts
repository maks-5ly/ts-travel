import { Module } from '@nestjs/common';
import { DataLoaderService } from '@/dataloader/services';
import { ToursModule } from '@/tours/tours.module';

@Module({
  imports: [ToursModule],
  exports: [DataLoaderService],
  providers: [DataLoaderService],
})
export class DataLoaderModule {}
