import { Injectable } from '@nestjs/common';

import { isNumber, isString } from 'class-validator';
import dayjs, { extend as extendDayJs, OpUnitType, unix } from 'dayjs';
import advancedFormatPlugin from 'dayjs/plugin/advancedFormat';
import durationPlugin from 'dayjs/plugin/duration';
import utcPlugin from 'dayjs/plugin/utc';

import {
  EnumHelperDateFormat,
  IHelperDateOptionsCreate,
  IHelperDateOptionsFormat,
  IHelperDateOptionsForward,
} from '@/utils/helper';

extendDayJs(utcPlugin);
extendDayJs(durationPlugin);
extendDayJs(advancedFormatPlugin);

@Injectable()
export class HelperDateService {
  check(date: string | Date | number): boolean {
    return date ? dayjs(date).isValid() : false;
  }

  create(
    date?: string | number | Date,
    options?: IHelperDateOptionsCreate,
  ): Date {
    let mDate: dayjs.Dayjs;

    if (isString(date)) {
      const num = Number(date);

      if (isNaN(num)) {
        mDate = dayjs(date);
      } else if (date.length === 10 || date.length === 14) {
        mDate = unix(num);
      } else {
        mDate = dayjs(num);
      }
    } else if (isNumber(date)) {
      const stringNum = date.toString();
      if (stringNum.length === 10 || stringNum.length === 14) {
        mDate = unix(date);
      } else {
        mDate = dayjs(date);
      }
    } else {
      mDate = dayjs.utc();
    }

    if (options?.startOfDay) {
      mDate.startOf('day');
    }

    return mDate.toDate();
  }

  forwardInMilliseconds(
    milliseconds: number,
    options?: IHelperDateOptionsForward,
  ): Date {
    return dayjs(options?.fromDate)
      .add(milliseconds, 'ms')
      .toDate();
  }

  format(date: Date | string, options?: IHelperDateOptionsFormat): string {
    return dayjs(date).format(options?.format ?? EnumHelperDateFormat.Date);
  }

  checkIsAfter(
    date1: string | number | Date,
    date2: string | number | Date,
    unit: OpUnitType = 'date',
  ) {
    return dayjs(date1).isAfter(dayjs(date2), unit);
  }
}
