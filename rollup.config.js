import importAlias from 'rollup-plugin-import-alias'
import nodeResolve from 'rollup-plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'
import typescriptPlugin from 'rollup-plugin-typescript2'
import external from '@yelo/rollup-node-external'

/** @type {import('rollup').RollupOptions[]} */
const config = [
  {
    external(request) {
      return (
        external()(request) || ['http', 'fs', 'util', 'path'].includes(request)
      )
    },
    input: 'src/index.ts',
    output: {
      file: 'dist/bundle.js',
      format: 'cjs',
      sourcemap: true,
    },
    plugins: [
      // @ts-ignore
      nodeResolve(),
      // @ts-ignore
      importAlias({
        '@': './src',
      }),
      typescriptPlugin({
        tsconfigOverride: {
          compilerOptions: {
            module: 'esnext',
          },
        },
      }),
      terser({
        ecma: 9,
        toplevel: true,
      }),
    ],
  },
]

export default config
