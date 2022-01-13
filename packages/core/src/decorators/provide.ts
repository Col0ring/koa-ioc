import { ensureArray, TargetFunction } from '@koa-ioc/misc'
import { ProvideMetadata, CreatorOrProvider } from '../type'
import { Decorator } from '../constants'
import { ensureProvider } from '../utils'

export function Provide(
  createOrProviders: CreatorOrProvider | CreatorOrProvider[]
): TargetFunction {
  return function (target) {
    const provideMetadata: ProvideMetadata =
      Reflect.getMetadata(Decorator.Provide, target) || []
    provideMetadata.push(
      ...ensureArray(createOrProviders).map((createOrProvider) =>
        ensureProvider(createOrProvider)
      )
    )
    Reflect.defineMetadata(Decorator.Provide, provideMetadata, target)
  }
}
