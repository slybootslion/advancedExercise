import path from 'path'
import ts from 'rollup-plugin-typescript2'
import { nodeResolve } from '@rollup/plugin-node-resolve'

export default {
  input: './src/index',
  output: {
    format: 'cjs',
    file: path.resolve(__dirname, 'dist/bundle.js'),
    exports: 'auto',
    sourcemap: true
  },
  plugins: [
    nodeResolve({
      extensions: ['.js', '.ts']
    }),
    ts({
      tsconfig: path.resolve(__dirname, 'tsconfig.json')
    }),
  ]
}
