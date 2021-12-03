import { TargetParamFunction, isString } from '@koa-ioc/misc'
import { Decorator } from '../constants'
import { NextMetadata } from '../type'

export function Next(): TargetParamFunction {
  return function (target, methodName, index) {
    if (isString(methodName)) {
      const nextMetadata: NextMetadata =
        Reflect.getMetadata(Decorator.Next, target, methodName) || []
      nextMetadata.push(index)
      Reflect.defineMetadata(Decorator.Next, nextMetadata, target, methodName)
    }
  }
}
