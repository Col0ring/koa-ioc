import { isClass, isUndefined, Creator } from '@koa-ioc/misc'
import { Provider, ClassProvider, ValueProvider, FactoryProvider } from './type'
import { createInstance } from './utils'

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

  private createClassInstance<T>(creator: Creator<T>): T {
    return createInstance(creator, (param, token) =>
      this.inject(token || param)
    )
  }

  provide<T>(provider: Provider<T>) {
    this.provides.set(provider.provide, provider)
  }
  inject(token: any) {
    const provider = this.provides.get(token)
    if (!provider) {
      return
    }
    if (this.isClass(provider)) {
      const target = provider.useClass
      return this.createClassInstance(target)
    } else if (this.isValue(provider)) {
      return provider.useValue
    } else if (this.isFactory(provider)) {
      return provider.useFactory()
    }
  }
}

// global container
const container = new Container()
export default container
