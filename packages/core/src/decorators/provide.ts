import { ensureArray, TargetFunction } from '@koa-ioc/misc'
import { Provider } from '../type'
import { Decorator } from '../constants'

export function Provide(providers: Provider | Provider[]): TargetFunction {
  return function (target) {
    Reflect.defineMetadata(Decorator.Provide, ensureArray(providers), target)
  }
}
