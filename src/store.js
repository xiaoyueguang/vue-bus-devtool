import {isObject} from './helper'
import {getFinalComment} from './comments'

/**
 * 为了欺骗 Vue-devtool 而构造的 store
 */
export const store = {
  state: Object.create(null),
  getters: Object.create(null)
}

/**
 * key 值映射
 */
export const keyMap = Object.create(null)

/**
 * 更新 store
 * @param {store} store
 * @param {vm}
 */
export function updateStore (store, $vm) {
  store.state = getStates($vm)
  store.getters = getGetters($vm)
}

/**
 * 获取对应的 states
 * @param {vm}
 * @param {string} path 路径
 * @return {states}
 */
function getStates ($vm, path = '') {
  const states = {}
  for (let key in $vm._data) {
    const finalKey = getFinalKey(key, path)
    // 只需要拿到第一层的映射即可
    path === '' && (keyMap[finalKey] = key)
    if (isObject($vm._data[key])) {
      states[finalKey] = getStates({_data: $vm._data[key]}, path + key + '.')
    } else {
      states[finalKey] = $vm._data[key]
    }
  }
  return states
}

/**
 * 获取对应的 getters
 * @param {vm}
 * @return {getters}
 */
function getGetters ($vm) {
  const getters = {}
  for (let key in $vm.$options.computed) {
    const finalKey = getFinalKey(key)
    getters[finalKey] = $vm.$options.computed[key].call($vm)
  }
  return getters
}

/**
 * 获取最终的 key 值
 * @param {string} key 键值
 * @param {string} path  路径
 * @return {string} 最终的 key 值
 */
export function getFinalKey (key, path = '') {
  path += key
  const comment = getFinalComment(path.split('.'))
  if (comment !== '') {
    return `${key} (${comment})`
  }
  return key
}