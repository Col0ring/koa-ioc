import { isClass } from '@koa-ioc/misc'
import chalk from 'chalk'
import { Decorator } from './constants'

export function isInjectable(val: any): boolean {
  return isClass(val) && !!Reflect.getMetadata(Decorator.Injectable, val)
}

function warn(message: string) {
  console.warn(chalk.yellowBright(message))
}

export const log = {
  warn,
}
