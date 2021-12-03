import { Creator, TargetObject, isString } from '@koa-ioc/misc'
import { Middleware } from 'koa'
import { Decorator } from '../constants'

export function Exception(handler: Middleware) {
  return function (target: Creator | TargetObject, methodName?: string) {
    if (isString(methodName)) {
      Reflect.defineMetadata(Decorator.Exception, handler, target, methodName)
    } else {
      Reflect.defineMetadata(Decorator.Exception, handler, target)
    }
  }
}
