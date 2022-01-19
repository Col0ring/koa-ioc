import prompts from 'prompts'
import minimist from 'minimist'
import { blue, cyan, red, reset } from 'kolorist'
import path from 'path'
import fs from 'fs'
import {
  toValidPackageName,
  isValidPackageName,
  isEmpty,
  emptyDir,
  getManager,
  copy,
} from './utils'
import { Project, Template, Scripts } from './type'

const TEMPLATES: Template[] = [
  {
    name: 'simple',
    color: blue,
  },
]
const DEFAULT_OUTPUT_DIR = 'koa-ioc-app'

const renameFiles: Record<string, string> = {
  _gitignore: '.gitignore',
}

const commands: Record<string, Scripts> = {
  npm: {
    install: 'npm i',
    start: 'npm run dev',
  },
  yarn: {
    install: 'yarn',
    start: 'yarn dev',
  },
  pnpm: {
    install: 'pnpm i',
    start: 'pnpm run dev',
  },
}

const cwd = process.cwd()
const argv = minimist(process.argv.slice(2))
let targetDir = argv._[0]
const template = argv.template || argv.t

const promptsChain: prompts.PromptObject<keyof Project>[] = [
  {
    type: targetDir ? null : 'text',
    name: 'name',
    message: reset('Project name:'),
    initial: targetDir,
    onState(state) {
      targetDir = state.value.trim() || DEFAULT_OUTPUT_DIR
      return targetDir
    },
  },
  {
    type: () =>
      !fs.existsSync(targetDir) || isEmpty(targetDir) ? null : 'confirm',
    name: 'overwrite',
    message: () =>
      (targetDir === '.'
        ? 'Current directory'
        : `Target directory "${targetDir}"`) +
      ` is not empty. Remove existing files and continue?`,
  },
  {
    type: (_, { overwrite }) => {
      // important
      if (overwrite === false) {
        throw new Error(red('✖') + ' Operation cancelled')
      }
      return null
    },
    name: 'overwriteChecker',
  },
  {
    type: () => (isValidPackageName(targetDir) ? null : 'text'),
    name: 'packageName',
    message: reset('Package name:'),
    initial: () => toValidPackageName(targetDir),
    validate: (dir) => isValidPackageName(dir) || 'Invalid package.json name',
  },
  {
    type: template ? null : 'select',
    name: 'template',
    message: 'Select a template:',
    initial: 0,
    choices: TEMPLATES.map((item) => ({
      title: item.color(item.name),
      value: item.name,
    })),
  },
]

async function init() {
  let projectInfo: Project

  try {
    projectInfo = (await prompts(promptsChain, {
      onCancel: () => {
        throw new Error(red('✖') + ' Operation cancelled')
      },
    })) as Project
  } catch (cancelled) {
    console.log((cancelled as Error).message)
    return
  }

  const root = path.join(cwd, targetDir)
  const { template: t, packageName, overwrite } = projectInfo
  if (overwrite) {
    emptyDir(root)
  } else if (!fs.existsSync(root)) {
    fs.mkdirSync(root)
  }

  console.log(cyan(`\nScaffolding project in ${root}...\n`))

  const templateDir = path.join(__dirname, '../templates', `${t}`)
  const files = fs.readdirSync(templateDir)
  for (const file of files.filter((f) => f !== 'package.json')) {
    const targetPath = renameFiles[file]
      ? path.join(root, renameFiles[file])
      : path.join(root, file)
    copy(path.join(templateDir, file), targetPath)
  }

  const pkg = (await import(path.join(templateDir, `package.json`))).default
  pkg.name = packageName || targetDir

  fs.writeFileSync(
    path.join(targetDir, 'package.json'),
    JSON.stringify(pkg, null, 2)
  )

  const packageManager = getManager()?.name || 'npm'
  console.log('✅ Done. You can start project by these steps:\n')
  console.log(` 👀 1. cd ${cyan(targetDir)}`)
  console.log(` 🔥 2. ${commands[packageManager]['install']}`)
  console.log(` 🚀 3. ${commands[packageManager]['start']}\n`)
}

init().catch((e) => console.log(e))
