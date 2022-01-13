import { TargetParamFunction, isString } from '@koa-ioc/misc'
import { Decorator, ParamPath } from '../constants'
import { ParamHandle, ParamMetadata, PipeOptions } from '../type'
import { Pipe } from './pipe'

export function defineParamDecorator<T>(handle: ParamHandle<T>) {
  return function (data?: T): TargetParamFunction {
    return function (target, methodName, index) {
      const paramMetadata: ParamMetadata =
        Reflect.getMetadata(Decorator.Param, target.constructor, methodName) ||
        []

      paramMetadata.push({
        handle,
        index,
        data,
      })

      Reflect.defineMetadata(
        Decorator.Param,
        paramMetadata,
        target.constructor,
        methodName
      )
    }
  }
}

function createParamDecorator<T extends string>(paramPath: string) {
  function ParamDecorator(): TargetParamFunction
  function ParamDecorator(name: T, ...pipes: PipeOptions[]): TargetParamFunction
  function ParamDecorator(...pipes: PipeOptions[]): TargetParamFunction
  function ParamDecorator(
    name?: T | PipeOptions,
    ...pipes: PipeOptions[]
  ): TargetParamFunction {
    return function (target, methodName, index) {
      if (isString(name)) {
        Pipe(...pipes)(target, methodName, index)
      } else {
        Pipe(...(name ? [name] : []), ...pipes)(target, methodName, index)
      }
      defineParamDecorator((_, ctx) => {
        const paths = paramPath.split('.')
        const value = paths.reduce<any>((prev, nextPath) => prev[nextPath], ctx)

        return isString(name) ? value?.[name] : value
      })()(target, methodName, index)
    }
  }
  return ParamDecorator
}

export const CustomParam = (paramPath: string, ...pipes: PipeOptions[]) =>
  createParamDecorator(paramPath)(...pipes)
export const Req = createParamDecorator(ParamPath.Req)
export const Res = createParamDecorator(ParamPath.Res)
export const Query = createParamDecorator(ParamPath.Query)
export const Session = createParamDecorator(ParamPath.Session)
export const Cookies = createParamDecorator(ParamPath.Cookies)
export const Param = createParamDecorator(ParamPath.Param)
export const Header = createParamDecorator(ParamPath.Header)
export const Body = createParamDecorator(ParamPath.Body)
export const UploadedFiles = createParamDecorator(ParamPath.Files)
export const UploadedFile = createParamDecorator(ParamPath.File)
