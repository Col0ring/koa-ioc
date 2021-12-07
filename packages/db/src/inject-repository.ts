import { getConnection } from 'typeorm'
import { Inject } from '@koa-ioc/core'
import { Creator, TargetConstructorFunction } from '@koa-ioc/misc'

// Inject Repository Decorator
export function InjectRepository(
  entity: Creator,
  connectionName?: string
): TargetConstructorFunction {
  return function (target, methodKey, index) {
    const repository = getConnection(connectionName).getRepository(entity)
    Inject(repository)(target, methodKey, index)
  }
}
