import { Module } from '@nestjs/common';
import { GraphQLModule, ID } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import compact from 'lodash/compact';
import { ConfigModule, ConfigService } from '@nestjs/config';
import path from 'node:path';
import { CustomUuidScalar } from '@/graphql/scalars/uuid.scalar';

import '@/graphql/enums';
import { DataLoaderModule } from '@/dataloader/dataloader.module';
import { DataLoaderService } from '@/dataloader/services';

@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [ConfigModule, DataLoaderModule],
      inject: [ConfigService, DataLoaderService],
      useFactory: (
        config: ConfigService,
        dataLoaderService: DataLoaderService,
      ) => ({
        driver: ApolloDriver,
        playground: config.get<boolean>('app.isDevelopment'),
        include: compact([]),
        autoSchemaFile: path.join(process.cwd(), 'src/schema.gql'),
        sortSchema: true,
        resolvers: [{ ID: CustomUuidScalar }],
        buildSchemaOptions: {
          scalarsMap: [
            {
              scalar: CustomUuidScalar,
              type: () => ID,
            },
          ],
          noDuplicatedFields: true,
        },
        context: ({ req }) => ({
          req,
          loaders: dataLoaderService.getLoaders(),
        }),
      }),
    }),
  ],
  providers: [],
})
export class GraphqlModule {}
