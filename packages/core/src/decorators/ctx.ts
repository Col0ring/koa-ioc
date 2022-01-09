import { TargetParamFunction, isString } from '@koa-ioc/misc'
import { Decorator } from '../constants'
import { CtxMetadata } from '../type'

export function Ctx(): TargetParamFunction {
  return function (target, methodName, index) {
    if (isString(methodName)) {
      const ctxMetadata: CtxMetadata =
        Reflect.getMetadata(Decorator.Ctx, target.constructor, methodName) || []
      ctxMetadata.push(index)
      Reflect.defineMetadata(
        Decorator.Ctx,
        ctxMetadata,
        target.constructor,
        methodName
      )
    }
  }
}
