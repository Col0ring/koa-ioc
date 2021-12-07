import { PromisifyValue } from '@koa-ioc/misc'

export interface ValidateOptions {
  onValid?: (originValue: any) => void
  onError?: (error: any, next: (error?: any) => void) => PromisifyValue<void>
}
