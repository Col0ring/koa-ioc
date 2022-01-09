import { isClass } from '@koa-ioc/misc'
import chalk from 'chalk'
import { Decorator } from './constants'
import { ControllerMetadata } from './type'

export function isInjectable(val: any): boolean {
  return isClass(val) && !!Reflect.getMetadata(Decorator.Injectable, val)
}

export function isController(val: any): boolean {
  if (!isClass(val)) {
    return false
  }
  const controllerMetadata: ControllerMetadata = Reflect.getMetadata(
    Decorator.Controller,
    val
  )
  return !!controllerMetadata?.controller
}

function warn(message: string) {
  console.warn(chalk.yellowBright(message))
}

export const log = {
  warn,
}
