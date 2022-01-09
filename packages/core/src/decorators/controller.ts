import { TargetFunction } from '@koa-ioc/misc'
import { Decorator } from '../constants'
import { ControllerMetadata } from '../type'

export function Controller(prefix = ''): TargetFunction {
  return function (target) {
    const controllerMetadata: ControllerMetadata = {
      controller: true,
      prefix,
    }
    Reflect.defineMetadata(Decorator.Controller, controllerMetadata, target)
  }
}
