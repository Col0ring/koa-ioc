import fs from 'fs'
import path from 'path'
export function isEmpty(dir: string) {
  return fs.readdirSync(dir).length === 0
}
export function emptyDir(dir: string) {
  if (!fs.existsSync(dir)) {
    return
  }
  for (const file of fs.readdirSync(dir)) {
    const abs = path.resolve(dir, file)
    // baseline is Node 12 so can't use rmSync :(
    if (fs.lstatSync(abs).isDirectory()) {
      emptyDir(abs)
      fs.rmdirSync(abs)
    } else {
      fs.unlinkSync(abs)
    }
  }
}
export function copy(src: string, dest: string) {
  const stat = fs.statSync(src)
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true })
    const files = fs.readdirSync(src)
    for (const file of files) {
      const srcPath = path.resolve(src, file)
      const destPath = path.resolve(dest, file)
      copy(srcPath, destPath)
    }
  } else {
    fs.copyFileSync(src, dest)
  }
}

export function isValidPackageName(projectName: string) {
  return /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(
    projectName
  )
}

export function toValidPackageName(projectName: string) {
  return projectName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/^[._]/, '')
    .replace(/[^a-z0-9-~]+/g, '-')
}

function pkgFromUserAgent(userAgent?: string) {
  if (!userAgent) return
  const pkgSpec = userAgent.split(' ')[0]
  const pkgSpecArr = pkgSpec.split('/')
  return {
    name: pkgSpecArr[0],
    version: pkgSpecArr[1],
  }
}

export function getManager() {
  // npm/6.14.15 node/v14.18.1 darwin x64
  return pkgFromUserAgent(process.env.npm_config_user_agent)
}
