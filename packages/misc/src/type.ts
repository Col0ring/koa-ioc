export type PromisifyValue<T = any> = Promise<T> | T

export type EnsureArray<T> = T extends any[] | readonly any[] ? T : T[]

export interface Creator<T = any, P extends any[] = any[]> {
  new (...args: P): T
}
export type TargetObject<T = any> = Record<PropertyKey, T>
export type TargetParamFunction = (
  target: TargetObject,
  methodKey: string,
  index: number
) => void
export type TargetMethodFunction = (
  target: TargetObject,
  methodKey: string
) => void
export type TargetConstructorFunction = (
  target: Creator,
  methodKey: undefined,
  index: number
) => void

export type TargetFunction = (target: Creator) => void
