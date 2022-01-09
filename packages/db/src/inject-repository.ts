import { getConnection } from 'typeorm'
import { Inject, Provide } from '@koa-ioc/core'
import { TargetConstructorFunction } from '@koa-ioc/misc'
import { EntityClassOrSchema } from './type'

// Inject Repository Decorator
export function InjectRepository(
  entity: EntityClassOrSchema,
  connectionName?: string
): TargetConstructorFunction {
  return function (target, methodKey, index) {
    const repository = getConnection(connectionName).getRepository(entity)
    Provide({ useValue: repository, provide: repository })(target)
    Inject(repository)(target, methodKey, index)
  }
}
