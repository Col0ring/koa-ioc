import { TargetFunction } from '@koa-ioc/misc'
import { Decorator } from '../constants'
import container from '../container'

export function Injectable(): TargetFunction {
  return function (target) {
    container.provide({
      provide: target,
      useClass: target,
    })
    Reflect.defineMetadata(Decorator.Injectable, true, target)
  }
}
