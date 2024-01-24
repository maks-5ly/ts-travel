import { Module } from '@nestjs/common';
import { TypeormDbService } from '@/db/service';
// import UserSeeder from '@/db/seeds/user.seeder';
import { UserModule } from '@/user/user.module';
import TravelSeeds from '@/db/seeds/travel.seeds';
import { HelperModule } from '@/utils/helper/helper.module';

@Module({
  imports: [UserModule, HelperModule],
  providers: [TypeormDbService, TravelSeeds],
  exports: [TypeormDbService],
})
export class DbModule {}
