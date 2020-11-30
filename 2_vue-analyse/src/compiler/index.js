import { parseHTML } from './parse'
import { generate } from './generate'

function compileToFunctions(template) {
  const ast = parseHTML(template)
  const code = generate(ast)
  const render = `with(this) {
    return ${code}
  }`
  // 字符串变函数
  return new Function(render)
}

export { compileToFunctions }
