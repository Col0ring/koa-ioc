import { EnsureArray, Creator } from './type'

export function noop() {
  // do nothing
}

export function isError(val: any): val is Error {
  return val instanceof Error
}

export function isUndefined(val: any): val is undefined {
  return typeof val === 'undefined'
}

export function isFunction(val: any): val is Function {
  return typeof val === 'function'
}
export function isString(val: any): val is string {
  return typeof val === 'string'
}

export function isNumber(val: any): val is number {
  return typeof val === 'number'
}

export function isObject(val: any): val is object {
  return typeof val === 'object' && val !== null
}

export function isClass(val: any): val is Creator {
  return (
    typeof val === 'function' &&
    /^class\s/.test(Function.prototype.toString.call(val))
  )
}

export function isPromise(val: any): val is Promise<any> {
  return val instanceof Promise
}

/**
 * change the type of val
 * @param val
 */
export function assertType<T>(val: any): asserts val is T {
  // do nothing
}

export function ensureArray<T>(val: T): EnsureArray<T> {
  return (Array.isArray(val) ? val : [val]) as EnsureArray<T>
}
