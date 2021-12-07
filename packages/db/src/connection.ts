import { createConnections, ConnectionOptions, Connection } from 'typeorm'

let connections: Connection[] = []

export async function useConnections(
  options: ConnectionOptions | ConnectionOptions[]
) {
  const connectOptions = Array.isArray(options) ? options : [options]
  await closeConnections()
  connections = await createConnections(connectOptions)
  return connections
}

export async function closeConnections() {
  await Promise.all(connections.map((connection) => connection.close()))
  connections = []
}
