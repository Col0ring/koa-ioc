import { PipeTransformer, ArgumentMetadata } from '@koa-ioc/core'
import { BadRequestException } from '@koa-ioc/exception'
import { validate } from 'class-validator'
import { plainToInstance } from 'class-transformer'

export class ValidatorPipe implements PipeTransformer {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value
    }
    const object = plainToInstance(metatype, value)
    const errors = await validate(object)
    if (errors.length > 0) {
      throw new BadRequestException({
        message: errors
          .map((error) =>
            error.constraints
              ? Object.values(error.constraints)
              : error.constraints
          )
          .join(),
      })
    }
    return value
  }
  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object]
    return !types.includes(metatype)
  }
}
