import { registerEnumType } from '@nestjs/graphql';
import { RoleEnum } from '@/roles/type/roles.interface';
import { SortOrder } from '@/utils/pagination/type';

registerEnumType(RoleEnum, {
  name: 'RoleEnum',
});

registerEnumType(SortOrder, {
  name: 'SortOrder',
});
