import {
  buildMessage,
  ValidateBy,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { HelperDateService } from '@/utils/helper/service/helper.date.service';

@Injectable()
@ValidatorConstraint()
export class IsDateAfterConstraint implements ValidatorConstraintInterface {
  constructor(private readonly helperDateService: HelperDateService) {}

  validate(
    value: any,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> | boolean {
    const [relatedPropertyName] = validationArguments.constraints;
    const relatedValue = (
      validationArguments.object as Record<string, unknown>
    )[relatedPropertyName] as Date;
    return this.helperDateService.checkIsAfter(value, relatedValue);
  }
}

export const IsDateAfter = (
  property: string,
  options?: ValidationOptions,
): PropertyDecorator =>
  ValidateBy(
    {
      name: 'IsDateAfter',
      constraints: [property],
      validator: IsDateAfterConstraint,
    },
    {
      ...options,
      message: buildMessage(
        (each: string): string => each + '$property must be after $constraint1',
        options,
      ),
    },
  );
