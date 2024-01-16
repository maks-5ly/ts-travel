import { Module } from '@nestjs/common';
import { ConfigModuleRoot } from '@/config';
import { DbModule } from '@/db/db.module';
import { TypeormDbService } from '@/db/service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '@/user/user.module';
import { TravelModule } from '@/travel/travel.module';
import { ToursModule } from '@/tours/tours.module';
import { AuthModule } from '@/auth/auth.module';
import { RouterModule } from '@/router/router.module';
import { ResponseModule } from '@/utils/response/response.module';
import { HelperModule } from '@/utils/helper/helper.module';

@Module({
  imports: [
    ConfigModuleRoot,
    DbModule,
    TypeOrmModule.forRootAsync({
      useClass: TypeormDbService,
    }),
    ResponseModule,
    UserModule,
    TravelModule,
    ToursModule,
    AuthModule,
    RouterModule,
    HelperModule,
  ],
  controllers: [],
  providers: [],
})
export class CommonModule {}
