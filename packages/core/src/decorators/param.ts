import { TargetParamFunction, isString } from '@koa-ioc/misc'
import { Decorator, ParamPath } from '../constants'
import { ParamMetadata, PipeOptions } from '../type'
import { Pipe } from './pipe'

function createParamDecorator<T extends string>(paramPath: string) {
  function ParamDecorator(): TargetParamFunction
  function ParamDecorator(name: T, ...pipes: PipeOptions[]): TargetParamFunction
  function ParamDecorator(...pipes: PipeOptions[]): TargetParamFunction
  function ParamDecorator(
    name?: T | PipeOptions,
    ...pipes: PipeOptions[]
  ): TargetParamFunction {
    return function (target, methodName, index) {
      const paramMetadata: ParamMetadata =
        Reflect.getMetadata(Decorator.Param, target, methodName) || []
      if (isString(name)) {
        paramMetadata.push({
          paramPath,
          index,
          name,
        })
        Pipe(...pipes)(target, methodName, index)
      } else {
        paramMetadata.push({
          paramPath,
          index,
        })
        Pipe(...(name ? [name] : []), ...pipes)(target, methodName, index)
      }

      Reflect.defineMetadata(Decorator.Param, paramMetadata, target, methodName)
    }
  }
  return ParamDecorator
}
export const CustomParam = (paramPath: string, ...pipes: PipeOptions[]) =>
  createParamDecorator(paramPath)(...pipes)
export const Req = createParamDecorator(ParamPath.Req)
export const Res = createParamDecorator(ParamPath.Res)
export const Query = createParamDecorator(ParamPath.Query)
export const Param = createParamDecorator(ParamPath.Param)
export const Header = createParamDecorator(ParamPath.Header)
export const Body = createParamDecorator(ParamPath.Body)
export const UploadFiles = createParamDecorator(ParamPath.Files)
