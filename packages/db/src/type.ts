import { Creator } from '@koa-ioc/misc'
import { EntitySchema } from 'typeorm'

export type EntityClassOrSchema = EntitySchema | Creator
