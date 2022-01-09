import { isClass, isUndefined } from '@koa-ioc/misc'
import { Provider, ClassProvider, ValueProvider, FactoryProvider } from './type'
import { createInstance } from './createInstance'

export class Container {
  private provides = new Map<any, Provider>()

  private isClass<T>(provider: Provider<T>): provider is ClassProvider<T> {
    return isClass((provider as ClassProvider<T>).useClass)
  }

  private isValue<T>(provider: Provider<T>): provider is ValueProvider<T> {
    return !isUndefined((provider as ValueProvider<T>).useValue)
  }

  private isFactory<T>(provider: Provider<T>): provider is FactoryProvider<T> {
    return isUndefined((provider as FactoryProvider<T>).useFactory)
  }

  provide<T>(provider: Provider<T>) {
    this.provides.set(provider.provide, provider)
  }
  inject(token: any, parentContainers: Container[] = []): any {
    const provider = this.provides.get(token)
    if (!provider) {
      for (const parentContainer of parentContainers) {
        const provide = parentContainer.inject(token)
        if (!isUndefined(provide)) {
          return provide
        }
      }
      return
    }
    if (this.isClass(provider)) {
      const target = provider.useClass
      return createInstance(target, [this, ...parentContainers])
    } else if (this.isValue(provider)) {
      return provider.useValue
    } else if (this.isFactory(provider)) {
      return provider.useFactory()
    }
  }
}

// global container
const globalContainer = new Container()
export default globalContainer
