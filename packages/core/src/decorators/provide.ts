import { ensureArray, TargetFunction } from '@koa-ioc/misc'
import { ProvideMetadata, Provider } from '../type'
import { Decorator } from '../constants'

export function Provide(providers: Provider | Provider[]): TargetFunction {
  return function (target) {
    const provideMetadata: ProvideMetadata =
      Reflect.getMetadata(Decorator.Provide, target) || []
    provideMetadata.push(...ensureArray(providers))
    Reflect.defineMetadata(Decorator.Provide, provideMetadata, target)
  }
}
