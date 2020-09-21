function flatArr (arr) {
  return arr.reduce((res, cur) => {
    return Array.isArray(cur) ? [...res, ...flatArr(cur)] : [...res, cur]
  }, [])
}

const arr = [1, 2, 3, [13, 15], [33, 35], [55, 56, 57, 58, [11, 12, [100]]]]

console.log(flatArr(arr))
