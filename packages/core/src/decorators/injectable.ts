import { TargetFunction } from '@koa-ioc/misc'
import { Decorator } from '../constants'

export function Injectable(): TargetFunction {
  return function (target) {
    Reflect.defineMetadata(Decorator.Injectable, true, target)
  }
}
