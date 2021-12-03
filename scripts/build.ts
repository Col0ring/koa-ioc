import { OutputOptions, rollup } from 'rollup'
import chalk from 'chalk'
import path from 'path'
import yargs from 'yargs'
import { createConfig } from './create-rollup-config'

async function build() {
  const packageName = (await yargs.parse(process.argv)).package as string
  if (!packageName) {
    console.log(
      chalk.yellowBright('Warning: the --package arg has not been given')
    )
    return
  }
  const options = createConfig(
    path.join(__dirname, `../packages/${packageName}`)
  )
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
  outputOptions.forEach((outputOption) => void genAndWrite(outputOption))
}

void build()
