export enum EnumHelperDateFormat {
  Date = 'YYYY-MM-DD',
  FriendlyDate = 'MMM, DD YYYY',
  FriendlyDateTime = 'MMMM Do YYYY, h:mm:ss a',
  YearMonth = 'YYYY-MM',
  MonthDate = 'MM-DD',
  OnlyYear = 'YYYY',
  OnlyMonth = 'MM',
  OnlyDate = 'DD',
  IsoDate = 'YYYY-MM-DDTHH:MM:SSZ',
  DayLong = 'dddd',
  DayShort = 'ddd',
  HourLong = 'HH',
  HourShort = 'H',
  MinuteLong = 'mm',
  MinuteShort = 'm',
  SecondLong = 'ss',
  SecondShort = 's',
}

export interface IHelperDateFormatOptions {
  timezone?: string;
  format?: EnumHelperDateFormat | string;
}

export enum EnumHelperDateDiff {
  Milis = 'milis',
  Seconds = 'seconds',
  Hours = 'hours',
  Days = 'days',
  Minutes = 'minutes',
}
