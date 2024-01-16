import { User } from '@/user/entities';
import { Travel } from '@/travel/entities/travel.entity';
import { IDataLoaders } from '@/dataloader/types';
import { Request } from 'express';

export type IRequestContext = {
  __user?: User;
  __travel?: Travel;
  loaders: IDataLoaders;
  req: Request & { user?: User };
};
