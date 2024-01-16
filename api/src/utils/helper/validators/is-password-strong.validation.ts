import { Injectable } from '@nestjs/common';

import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsPasswordStrongConstraint
  implements ValidatorConstraintInterface
{
  validate(value: string, args: ValidationArguments): boolean {
    const [length] = args.constraints;
    return this.checkPasswordStrong(value, length);
  }

  // Ideally should be moved to the separate HelperService
  private checkPasswordStrong(password: string, length?: number): boolean {
    if (!password) {
      return false;
    }

    const regex = new RegExp(
      `^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{${
        length || 8
      },}$`,
    );

    return regex.test(password);
  }
}

export function IsPasswordStrong(
  minLength = 8,
  validationOptions?: ValidationOptions,
) {
  return function (object: Record<string, any>, propertyName: string): any {
    registerDecorator({
      name: 'IsPasswordStrong',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: 'password is not strong enough',
        ...validationOptions,
      },
      constraints: [minLength],
      validator: IsPasswordStrongConstraint,
    });
  };
}
