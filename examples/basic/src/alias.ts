import path from 'path'
import { addAliases } from 'module-alias'

const packages = ['core', 'exception', 'pipe', 'auth']

function createAlias(names: string[]) {
  return names.reduce((prev, next) => {
    prev[`@koa-ioc/${next}`] = path.resolve(
      __dirname,
      `../../../packages/${next}/src/index.ts`
    )
    return prev
  }, {} as Record<string, string>)
}

// add alias
addAliases(createAlias(packages))
