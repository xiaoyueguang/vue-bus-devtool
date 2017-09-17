
/**
 * 延迟执行
 * @param {function} fn
 */
export function delay (fn) {
  setTimeout(fn)
}

export const toString = Object.prototype.toString
/**
 * 判断是否为对象
 * @param {any}
 * @return {boolean}
 */
export const isObject = obj => toString.call(obj) === '[object Object]'

/**
 * 比较两个对象, 并返回不一样的部分的路径
 * @param {object} before
 * @param {object} after
 * @return {string}
 */
export function objDiff (before, after) {
  const diffObj = Object.create(null)
  for (let key in after) {
    const beforeValue = before[key]
    const afterValue = after[key]
    if (isObject(afterValue)) {
      const sunDiffObj = objDiff(beforeValue, afterValue)
      !isEmptyObject(sunDiffObj) && (diffObj[key] = sunDiffObj)
    } else {
      if (beforeValue !== afterValue) {
        diffObj[key] = beforeValue + ' => ' + afterValue
      }
    }
  }
  return diffObj
}


/**
 * 判断对象是否为空
 * @param {object} obj 
 */
export function isEmptyObject (obj) {
  let key
  for (key in obj) {
    return key
  }
  return false
}

window.aaa = isEmptyObject