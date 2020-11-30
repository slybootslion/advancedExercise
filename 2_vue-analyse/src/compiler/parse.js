const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
const startTagOpen = new RegExp(`^<${qnameCapture}`) // 标签开头的正则 捕获的内容是标签名
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`) // 匹配结尾的标签 </div>
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/ // 匹配属性
const startTagClose = /^\s*(\/?)>/ // 匹配结束的标签 >

function parseHTML(html) {
  // 生成ast语法树
  function createASTElement(tag, attrs) {
    return { tag, type: 1, children: [], attrs, parent: null }
  }

  let root = null
  let currentParent
  const stack = []

  function advance(n) {
    html = html.substring(n)
  }

  function start(tagName, attrs) {
    const element = createASTElement(tagName, attrs)
    if (!root) {
      root = element
    }
    currentParent = element
    stack.push(element)
  }

  function end(tagName) {
    const element = stack.pop()
    currentParent = stack[stack.length - 1]
    if (currentParent) {
      element.parent = currentParent
      currentParent.children.push(element)
    }
  }

  function chars(text) {
    text = text.replace(/\s/g, '')
    if (text) {
      currentParent.children.push({
        type: 3,
        text,
      })
    }
  }

  function parseStartTag() {
    const start = html.match(startTagOpen)
    if (start) {
      let match = {
        tagName: start[1],
        attrs: [],
      }
      advance(start[0].length)
      // 查找属性 （开始标签开头和结尾中间的部分）
      let end, attr
      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        advance(attr[0].length)
        match.attrs.push({ name: attr[1], value: attr[3] || attr[4] || attr[5] || true })
      }
      if (end) {
        advance(end[0].length)
        return match
      }
    }
  }

  while (html) {
    const textEnd = html.indexOf('<')
    if (textEnd === 0) {
      // 开始标签
      const startTagMatch = parseStartTag()
      if (startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs)
        continue
      }
      // 结束标签
      let endTagMatch = html.match(endTag)
      if (endTagMatch) {
        advance(endTagMatch[0].length)
        end(endTagMatch[1])
        continue
      }
    }

    let text
    if (textEnd > 0) {
      text = html.substring(0, textEnd)
    }
    if (text) {
      advance(text.length)
      chars(text)
    }
  }

  return root
}

export {
  parseHTML
}
