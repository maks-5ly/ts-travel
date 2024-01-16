import { DataSource, DataSourceOptions } from 'typeorm';

import { ConfigModuleRoot } from '@/config';
import dbConfiguration from '@/config/database.config';

export default new DataSource(
  ConfigModuleRoot && (dbConfiguration().connection as DataSourceOptions),
);
