import { ArgumentMetadata, PipeTransformer } from '@koa-ioc/core'

export class Validator implements PipeTransformer {
  transform(val: string, { metatype }: ArgumentMetadata) {
    return val + 'validated'
  }
}
