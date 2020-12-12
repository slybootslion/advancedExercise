function patchProp(el, key, prevValue, value) {
  switch (key) {
    case 'style':
      patchStyle(el, prevValue, value)
      break
    case 'className':
      patchClassName(el, value)
      break
    default:
      patchAttr(el, key, value)
  }
}

function patchAttr(el, key, value) {
  if (value == null) {
    el.removeAttribute(key)
  } else {
    el.setAttribute(key, value)
  }
}

function patchClassName(el, value) {
  if (value == null) value = ''
  el.className = value
}

function patchStyle(el, prevValue, value) {
  const style = el.style
  if (!value) {
    el.removeAttribute('style')
  } else {
    for (const key in value) {
      style[key] = value[key]
    }

    if (prevValue) {
      for (const pKey in prevValue) {
        if (!value[pKey]) {
          style[pKey] = ''
        }
      }
    }
  }
}

export { patchProp }
