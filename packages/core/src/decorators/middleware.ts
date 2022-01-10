import {
  Creator,
  ensureArray,
  TargetObject,
  isFunction,
  isString,
} from '@koa-ioc/misc'
import { Decorator, MiddlewarePosition } from '../constants'
import { MiddlewareMetadata, MiddlewareOptions } from '../type'

export function Middleware(
  middleware: MiddlewareOptions | MiddlewareOptions[]
) {
  return function (target: Creator | TargetObject, methodName?: string) {
    const middlewares: MiddlewareMetadata = ensureArray(middleware).map(
      (mdw) => {
        if (isFunction(mdw)) {
          return {
            position: MiddlewarePosition.Pre,
            middleware: mdw,
          }
        }
        return mdw
      }
    )

    if (isString(methodName)) {
      const middlewareMetaData: MiddlewareMetadata =
        Reflect.getMetadata(
          Decorator.MethodMiddleware,
          target.constructor,
          methodName
        ) || []
      middlewareMetaData.push(...middlewares)
      Reflect.defineMetadata(
        Decorator.MethodMiddleware,
        middlewareMetaData,
        target.constructor,
        methodName
      )
    } else {
      const middlewareMetaData: MiddlewareMetadata =
        Reflect.getMetadata(Decorator.Middleware, target) || []
      middlewareMetaData.push(...middlewares)
      Reflect.defineMetadata(Decorator.Middleware, middlewareMetaData, target)
    }
  }
}
