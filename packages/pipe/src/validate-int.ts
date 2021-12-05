import { PipeTransformer } from '@koa-ioc/core'
import { BadRequestException } from '@koa-ioc/exception'
import { Validator } from './validator'

export class ValidatorIntegerPipe extends Validator implements PipeTransformer {
  async transform(value: any) {
    const num = +value
    if (Number.isNaN(num)) {
      const errorInstance = new BadRequestException({
        message: 'Please input a integer',
      })
      await this.throwError(errorInstance)
      return value
    }
    this.onValid(value)
    return num
  }
}
