
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
