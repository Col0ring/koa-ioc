import { PipeTransformer } from '@koa-ioc/core'
import { BadRequestException } from '@koa-ioc/exception'
import { Validator } from './validator'

export class ValidatorNotEmptyPipe
  extends Validator
  implements PipeTransformer
{
  async transform(value: any) {
    if (value) {
      const errorInstance = new BadRequestException({
        message: 'Please input non-empty data',
      })
      await this.throwError(errorInstance)
      return value
    }
    this.onValid(value)
    return value
  }
}
