import { defineConfig } from 'rollup'
import path from 'path'
import typescript from '@rollup/plugin-typescript'
import dts from 'rollup-plugin-dts'
import commonjs from 'rollup-plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import json from '@rollup/plugin-json'
import eslint from 'rollup-plugin-eslint2'
import { getBabelOutputPlugin } from '@rollup/plugin-babel'
import { terser } from 'rollup-plugin-terser'
import del from 'rollup-plugin-delete'
const extensions = ['.ts', '.js', '.json']
export async function createConfig(dir: string) {
  const pkg = (await import(`${path.resolve(dir, './package.json')}`)).default

  return defineConfig([
    {
      input: path.resolve(dir, './src/index.ts'),
      plugins: [
        eslint({
          fix: true,
          include: ['**/*.ts'],
        }),
        typescript({
          tsconfig: path.resolve(dir, './tsconfig.json'),
        }),
        getBabelOutputPlugin({
          presets: [['@babel/preset-env', { modules: false }]],
          plugins: [
            ['@babel/plugin-transform-runtime', { useESModules: true }],
          ],
        }),
        json(),
        commonjs(),
        resolve({
          extensions,
        }),
        terser(),
        del({ targets: path.resolve(dir, './dist') }),
      ],
      external: [
        ...Object.keys(pkg.dependencies || {}),
        ...Object.keys(pkg.devDependencies || {}),
        /^@koa-ioc\//,
      ],
      output: [
        {
          file: path.resolve(dir, './dist/index.cjs.js'),
          format: 'cjs',
          sourcemap: 'hidden',
        },
        {
          file: path.resolve(dir, './dist/index.esm.js'),
          format: 'esm',
          sourcemap: 'hidden',
        },
      ],
    },
    // dts
    {
      input: path.resolve(dir, './dist/types/index.d.ts'),
      external: [...Object.keys(pkg.dependencies || {}), /^@koa-ioc\//],
      output: [
        {
          file: path.resolve(dir, './dist/index.d.ts'),
          format: 'es',
        },
      ],
      plugins: [dts()],
    },
  ])
}
