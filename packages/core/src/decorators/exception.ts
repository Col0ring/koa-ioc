import { Creator, TargetObject, isString } from '@koa-ioc/misc'
import { ExceptionHandler } from '../type'
import { Decorator } from '../constants'

export function Exception(handler: ExceptionHandler) {
  return function (target: Creator | TargetObject, methodName?: string) {
    if (isString(methodName)) {
      Reflect.defineMetadata(
        Decorator.MethodException,
        handler,
        target.constructor,
        methodName
      )
    } else {
      // creator
      Reflect.defineMetadata(Decorator.Exception, handler, target)
    }
  }
}
