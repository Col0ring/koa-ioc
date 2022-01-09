import { OutputOptions, rollup, RollupOptions } from 'rollup'
import chalk from 'chalk'
import rimraf from 'rimraf'
import path from 'path'
import yargs from 'yargs'
import { createConfig } from './create-rollup-config'

async function remove(pathname: string) {
  return new Promise<void>((resolve, reject) => {
    rimraf(pathname, (error) => {
      if (error) {
        reject(error)
      }
      resolve()
    })
  })
}

async function build() {
  const packageName = (await yargs.parse(process.argv)).package as string
  if (!packageName) {
    console.log(
      chalk.yellowBright('Warning: the --package arg has not been given')
    )
    return
  }
  const configDir = path.join(__dirname, `../packages/${packageName}`)
  const config = await createConfig(configDir)
  for (const options of config) {
    await compile(options)
  }

  // delete types dir
  await remove(path.join(configDir, './dist/types'))

  async function compile(options: RollupOptions) {
    const outputOptions = options.output
      ? Array.isArray(options.output)
        ? options.output
        : [options.output]
      : []

    // create a bundle
    const bundle = await rollup(options)
    async function genAndWrite(outputOption: OutputOptions) {
      await bundle.generate(outputOption)
      // or write the bundle to disk
      await bundle.write(outputOption)
      // closes the bundle
      await bundle.close()
    }
    await Promise.all(
      outputOptions.map((outputOption) => genAndWrite(outputOption))
    )
  }
}

void build()
