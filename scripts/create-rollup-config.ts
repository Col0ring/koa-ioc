import { defineConfig } from 'rollup'
import path from 'path'
import typescript from '@rollup/plugin-typescript'
import commonjs from 'rollup-plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import json from '@rollup/plugin-json'
import eslint from 'rollup-plugin-eslint2'
import { getBabelOutputPlugin } from '@rollup/plugin-babel'
import { terser } from 'rollup-plugin-terser'
import del from 'rollup-plugin-delete'
const extensions = ['.ts', '.js', '.json']
export function createConfig(dir: string) {
  return defineConfig({
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
      'koa',
      '@koa/router',
      'koa-body',
      'class-validator',
      'class-transformer',
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
  })
}
