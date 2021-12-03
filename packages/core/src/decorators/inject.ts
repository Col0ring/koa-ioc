import { TargetConstructorFunction, isString } from '@koa-ioc/misc'
import { Decorator } from '../constants'
import { InjectMetadata } from '../type'

export function Inject(value?: any): TargetConstructorFunction {
  return function (
    target,
    // constructor
    methodName,
    index
  ) {
    // constructor
    if (!isString(methodName)) {
      const injects: InjectMetadata[] =
        Reflect.getMetadata(Decorator.Inject, target) || []
      injects[index] = value
      Reflect.defineMetadata(Decorator.Inject, injects, target)
    }
  }
}
