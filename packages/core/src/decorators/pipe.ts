import { Creator, TargetObject, isNumber, isString } from '@koa-ioc/misc'
import { Decorator } from '../constants'
import { PipeOptions, PipeMetadata } from '../type'

export function Pipe(...pipes: PipeOptions[]) {
  return function (
    target: Creator | TargetObject,
    methodName?: string,
    index?: number | PropertyDescriptor
  ) {
    // method, method params
    if (isString(methodName)) {
      const pipeMetadata: PipeMetadata =
        Reflect.getMetadata(Decorator.Pipe, target, methodName) || []
      if (isNumber(index)) {
        pipeMetadata.push(
          ...pipes.map((pipe) => ({
            index,
            pipe,
          }))
        )
        Reflect.defineMetadata(Decorator.Pipe, pipeMetadata, target, methodName)
      } else {
        pipeMetadata.push(
          ...pipes.map((pipe) => ({
            pipe,
          }))
        )
        Reflect.defineMetadata(Decorator.Pipe, pipeMetadata, target, methodName)
      }

      // class
    } else {
      const pipeMetadata: PipeMetadata =
        Reflect.getMetadata(Decorator.Pipe, target) || []
      pipeMetadata.push(
        ...pipes.map((pipe) => ({
          pipe,
        }))
      )
      Reflect.defineMetadata(Decorator.Pipe, pipeMetadata, target)
    }
  }
}
