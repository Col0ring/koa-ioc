import { PipeTransformer, ArgumentMetadata } from '@koa-ioc/core'
import { BadRequestException } from '@koa-ioc/exception'
import { validate } from 'class-validator'
import { plainToInstance } from 'class-transformer'
import { Validator } from './validator'

export class ValidateClassPipe extends Validator implements PipeTransformer {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value
    }
    const object = plainToInstance(metatype, value)
    const errors = await validate(object)
    if (errors.length > 0) {
      const errorInstance = new BadRequestException({
        message: errors
          .map((error) =>
            error.constraints
              ? Object.values(error.constraints)
              : error.constraints
          )
          .join(),
      })
      await this.throwError(errorInstance)
      return value
    }
    this.onValid(value)
    return value
  }
  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object]
    return !types.includes(metatype)
  }
}
