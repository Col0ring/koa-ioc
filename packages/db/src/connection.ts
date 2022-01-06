import { ensureArray } from '@koa-ioc/misc'
import { createConnections, ConnectionOptions, Connection } from 'typeorm'

let connections: Connection[] = []

export async function useConnections(
  options: ConnectionOptions | ConnectionOptions[]
) {
  await closeConnections()
  connections = await createConnections(ensureArray(options))
  return connections
}

export async function closeConnections() {
  await Promise.all(connections.map((connection) => connection.close()))
  connections = []
}
