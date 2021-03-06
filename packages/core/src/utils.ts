import { Creator, isClass } from '@koa-ioc/misc'
import chalk from 'chalk'
import { Decorator } from './constants'
import { ControllerMetadata, Provider } from './type'

export function isInjectable(val: any): boolean {
  return isClass(val) && !!Reflect.getMetadata(Decorator.Injectable, val)
}

export function isController(val: any): boolean {
  const controllerMetadata: ControllerMetadata = Reflect.getMetadata(
    Decorator.Controller,
    val
  )
  return !!controllerMetadata?.controller
}

export function ensureProvider<T>(
  creatorOrProvider: Creator<T> | Provider<T>
): Provider<T> {
  if (isClass(creatorOrProvider)) {
    return {
      useClass: creatorOrProvider,
      provide: creatorOrProvider,
    }
  }
  return creatorOrProvider
}

function success(message: string) {
  console.log(chalk.greenBright(message))
}

function warn(message: string) {
  console.warn(chalk.yellowBright(message))
}

function error(message: string) {
  console.error(chalk.redBright(message))
}

export const log = {
  success,
  warn,
  error,
}
