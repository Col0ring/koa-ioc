import {
  Creator,
  TargetObject,
  isNumber,
  isString,
  isClass,
} from '@koa-ioc/misc'
import { Decorator } from '../constants'
import { PipeOptions, PipeMetadata, PipeTransformer } from '../type'

const pipeClassCacheMap = new Map<Creator<PipeTransformer>, PipeTransformer>()

function getPipeInstance(pipe: PipeOptions) {
  let instance: PipeTransformer
  if (isClass(pipe)) {
    if (pipeClassCacheMap.has(pipe)) {
      instance = pipeClassCacheMap.get(pipe)!
    } else {
      instance = new pipe()
      pipeClassCacheMap.set(pipe, instance)
    }
  } else {
    instance = pipe
  }
  return instance
}

export function Pipe(...pipes: PipeOptions[]) {
  return function (
    target: Creator | TargetObject,
    methodName?: string,
    index?: number | PropertyDescriptor
  ) {
    // method, method params
    if (isString(methodName)) {
      const pipeMetadata: PipeMetadata =
        Reflect.getMetadata(
          Decorator.MethodPipe,
          target.constructor,
          methodName
        ) || []
      if (isNumber(index)) {
        pipeMetadata.push(
          ...pipes.map((pipe) => ({
            index,
            pipe: getPipeInstance(pipe),
          }))
        )
        Reflect.defineMetadata(
          Decorator.MethodPipe,
          pipeMetadata,
          target.constructor,
          methodName
        )
      } else {
        pipeMetadata.push(
          ...pipes.map((pipe) => ({
            pipe: getPipeInstance(pipe),
          }))
        )
        Reflect.defineMetadata(
          Decorator.MethodPipe,
          pipeMetadata.constructor,
          target,
          methodName
        )
      }

      // class
    } else {
      const pipeMetadata: PipeMetadata =
        Reflect.getMetadata(Decorator.Pipe, target) || []
      pipeMetadata.push(
        ...pipes.map((pipe) => ({
          pipe: getPipeInstance(pipe),
        }))
      )
      Reflect.defineMetadata(Decorator.Pipe, pipeMetadata, target)
    }
  }
}
