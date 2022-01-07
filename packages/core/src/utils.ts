import { isFunction, Creator } from '@koa-ioc/misc'
import chalk from 'chalk'
import { Decorator, Metadata } from './constants'
import { ParamsInjectMetadata } from './type'

export function isInjectable(val: any): boolean {
  return isFunction(val) && !!Reflect.getMetadata(Decorator.Injectable, val)
}

export function createInstance<T>(
  creator: Creator<T>,
  argsMapping: (param: any, token: any) => any
): T {
  const params: ParamsInjectMetadata =
    Reflect.getMetadata(Metadata.Params, creator) || []
  const injects: ParamsInjectMetadata =
    Reflect.getMetadata(Decorator.ParamsInject, creator) || []
  const args = params.map((param, index) => {
    return argsMapping(param, injects[index])
  })
  return Reflect.construct(creator, args)
}

function warn(message: string) {
  console.warn(chalk.yellowBright(message))
}

export const log = {
  warn,
}
