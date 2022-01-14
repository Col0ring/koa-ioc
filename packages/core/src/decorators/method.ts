import { TargetMethodFunction } from '@koa-ioc/misc'
import { Decorator, Method } from '../constants'
import { MethodMetadata, ResponseOptions } from '../type'

function createMethodDecorator(method: Method) {
  return function (
    path = '',
    responseOptions?: ResponseOptions
  ): TargetMethodFunction {
    return function (target, methodName) {
      const methodMetadata: MethodMetadata =
        Reflect.getMetadata(Decorator.Method, target.constructor) || []
      methodMetadata.push({
        path,
        responseOptions,
        method,
        name: methodName,
      })
      Reflect.defineMetadata(
        Decorator.Method,
        methodMetadata,
        target.constructor
      )
    }
  }
}

export const All = createMethodDecorator(Method.All)
export const Get = createMethodDecorator(Method.Get)
export const Post = createMethodDecorator(Method.Post)
export const Put = createMethodDecorator(Method.Put)
export const Delete = createMethodDecorator(Method.Delete)
export const Patch = createMethodDecorator(Method.Patch)
export const Options = createMethodDecorator(Method.Options)
export const Head = createMethodDecorator(Method.Head)
