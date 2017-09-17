import {isObject} from './helper'

/**
 * 私有注释对象
 */
export const _comments = {}

/**
 * 获取最终的注释
 * @param {string} paths 路径
 * @return {string} 注释
 */
export function getFinalComment (paths) {
  if (paths.length === 1) {
    let comment = _comments[paths[0]]
    return isObject(comment) ? comment._comment : comment || ''
  }

  let comment = ''
  let current = _comments
  let i = 0
  while (++i) {
    current = current[paths[i - 1]] || ''
    if (i === paths.length) break
  }

  return isObject(current) ? current._comment : current
}