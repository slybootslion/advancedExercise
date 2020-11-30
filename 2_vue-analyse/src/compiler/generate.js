const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g

function genAttr(attrs) {
  let str = ''
  for (let i = 0; i < attrs.length; i++) {
    const attr = attrs[i]
    if (attr.name === 'style') {
      const obj = {}
      attr.value.split(';').forEach(item => {
        const itemArr = item.split(':')
        obj[itemArr[0]] = itemArr[1]
      })
      attr.value = obj
    }
    str += `${attr.name}: ${JSON.stringify(attr.value)},`
  }
  return `{ ${str.slice(0, -1)}}`
}

// 区分元素还是文本
function gen(child) {
  if (child.type === 1) {
    // 元素
    return genChildren(child.children)
  } else {
    // 文本
    const t = child.text
    if (defaultTagRE.test(t)) {
      // 插值表达式
      const tokens = []
      let match
      let index = 0
      let lastIdx = (defaultTagRE.lastIndex = 0)

      while ((match = defaultTagRE.exec(t))) {
        index = match.index
        if (index > lastIdx) {
          tokens.push(JSON.stringify(t.slice(lastIdx, index)))
        }
        tokens.push(`_s(${match[1].trim()})`)
        lastIdx = index + match[0].length
      }

      if (lastIdx < t.length) tokens.push(JSON.stringify(t.slice(lastIdx)))

      return `_v(${tokens.join('+')})`
    } else {
      // 普通文本
      return `_v(${JSON.stringify(t)})`
    }
  }
}

function genChildren(children) {
  if (children) {
    return children.map(child => gen(child)).join(',')
  }
}

// ast -> str -> Function
function generate(ast) {
  return `_c('${ast.tag}', ${ast.attrs.length ? genAttr(ast.attrs) : undefined} ${
    ast.children ? `,${genChildren(ast.children)}` : ''
  })`
}

export { generate }
