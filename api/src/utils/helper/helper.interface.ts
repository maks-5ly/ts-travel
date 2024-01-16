import { EnumHelperDateDiff, EnumHelperDateFormat } from './helper.constant';

export interface IHelperJwtOptions {
  expiredIn: string;
  notBefore?: string;
  secretKey: string;
}

export interface IHelperJwtVerifyOptions {
  secretKey: string;
}

export interface IHelperStringRandomOptions {
  upperCase?: boolean;
  safe?: boolean;
  prefix?: string;
}

export interface IHelperGeoCurrent {
  latitude: number;
  longitude: number;
}

export interface IHelperGeoRules extends IHelperGeoCurrent {
  radiusInMeters: number;
}

// Helper Date
export interface IHelperDateExtractDate {
  date: Date;
  day: string;
  month: string;
  year: string;
}

export interface IHelperDateOptionsDiff {
  format?: EnumHelperDateDiff;
}

export interface IHelperDateOptionsCreate {
  startOfDay?: boolean;
}

export interface IHelperDateOptionsFormat {
  format?: EnumHelperDateFormat | string;
}

export interface IHelperDateOptionsForward {
  fromDate?: Date;
}

export type IHelperDateOptionsBackward = IHelperDateOptionsForward;

// Helper File
export type IHelperFileRows = Record<string, string | number | Date>;

export interface IHelperFileWriteExcelOptions {
  password?: string;
  type?: 'xlsx' | 'xls' | 'csv';
}

export interface IHelperFileCreateExcelWorkbookOptions {
  sheetName?: string;
}

export interface IHelperFileReadExcelOptions {
  sheet?: string | number;
  password?: string;
}
