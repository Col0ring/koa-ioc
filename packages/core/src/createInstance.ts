import { Creator } from '@koa-ioc/misc'
import {
  ImportMetadata,
  ParamsInjectMetadata,
  PropertiesInjectMetadata,
  ProvideMetadata,
} from './type'
import globalContainer, { Container } from './container'
import { Decorator, Metadata } from './constants'

export function createInstance<T>(
  creator: Creator<T>,
  parentContainer: Container[] = [globalContainer]
): T | void {
  const constructorParams: ParamsInjectMetadata =
    Reflect.getMetadata(Metadata.Params, creator) || []

  const imports: ImportMetadata =
    Reflect.getMetadata(Decorator.Import, creator) || []

  const properties: PropertiesInjectMetadata =
    Reflect.getMetadata(Decorator.PropertiesInject, creator) || []

  const params: ParamsInjectMetadata =
    Reflect.getMetadata(Decorator.ParamsInject, creator) || []
  const providers: ProvideMetadata =
    Reflect.getMetadata(Decorator.Provide, creator) || []
  const container = new Container()
  providers.forEach((provider) => container.provide(provider))

  imports.forEach((importItem) =>
    container.provide({
      provide: importItem,
      useClass: importItem,
    })
  )

  const args = constructorParams.map((paramType, index) => {
    return container.inject(params[index] || paramType, parentContainer)
  })
  const instance = Reflect.construct(creator, args)
  properties.forEach(({ key, type }) => {
    instance[key] = container.inject(type, parentContainer)
  })
  return instance
}
