import { isUndefined, Creator, TargetObject, isNumber } from '@koa-ioc/misc'
import { Decorator } from '../constants'
import { ParamsInjectMetadata, PropertiesInjectMetadata } from '../type'

export function Inject<T = any>(token?: T) {
  return function (
    target: Creator | TargetObject,
    // constructor
    key: string | symbol | undefined,
    index?: number
  ) {
    // constructor
    if (isUndefined(key)) {
      if (!isNumber(index)) {
        return
      }
      const params: ParamsInjectMetadata =
        Reflect.getMetadata(Decorator.ParamsInject, target) || []
      params[index] = token
      Reflect.defineMetadata(Decorator.ParamsInject, params, target)
      return
    }

    const type = token || Reflect.getMetadata('design:type', target, key)
    const properties: PropertiesInjectMetadata =
      Reflect.getMetadata(Decorator.PropertiesInject, target.constructor) || []
    properties.push({
      key,
      type,
    })
    Reflect.defineMetadata(
      Decorator.PropertiesInject,
      properties,
      target.constructor
    )
  }
}
