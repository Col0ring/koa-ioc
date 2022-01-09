import { Creator, TargetFunction } from '@koa-ioc/misc'
import { Decorator } from '../constants'
import { ImportMetadata } from '../type'
import { isInjectable } from '../utils'

export function Import(imports: Creator[]): TargetFunction {
  return function (target) {
    const importsMetadata: ImportMetadata =
      Reflect.getMetadata(Decorator.Import, target) || []

    imports.forEach((creator) => {
      if (isInjectable(creator)) {
        importsMetadata.push(creator)
      }
    })

    Reflect.defineMetadata(Decorator.Import, importsMetadata, target)
  }
}
