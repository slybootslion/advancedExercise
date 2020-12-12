export function isObject(obj): boolean {
  return typeof obj === 'object' && obj != null
}

const hasOwnProperty = Object.prototype.hasOwnProperty

export function hasOwn(target, key): boolean {
  return hasOwnProperty.call(target, key)
}

export function isArray(arr): boolean {
  return Array.isArray(arr)
}

export function hasChange(v1, v2): boolean {
  return v1 !== v2
}

export function isFunction(fun): boolean {
  return typeof fun === 'function'
}
