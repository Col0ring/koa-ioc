import { isFunction } from '@koa-ioc/misc'
import { Decorator } from './constants'

export function isInjectable(val: any): boolean {
  return isFunction(val) && !!Reflect.getMetadata(Decorator.Injectable, val)
}
