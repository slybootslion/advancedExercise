import { parseHTML } from './parse'
import { generate } from './generate'

const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g

function compileToFunctions(template) {
  const ast = parseHTML(template)
  const code = generate(ast)
  console.log(code)
}

export { compileToFunctions }
