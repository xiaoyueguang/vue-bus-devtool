import {isObject} from './helper'
import {getFinalComment} from './comments'

let matchOriginKeyRE = /[_$*a-zA-Z0-9]*/
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
window.keyMap = keyMap
/**
 * 更新 store
 * @param {store} store
 * @param {vm}
 */
export function updateStore (store, $vm) {
  store.state = getStates($vm)
  store.getters = getGetters($vm)
  setKeyMap(store.state, keyMap)
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
    let result = false
    if (result = isObject($vm._data[key])) {
      states[finalKey] = getStates({_data: $vm._data[key]}, path + key + '.')
    } else {
      states[finalKey] = $vm._data[key]
    }
  }
  return states
}

/**
 * 设置映射
 * @param {object} states 状态值
 * @param {object} keyMap 当前映射值
 */
export function setKeyMap (states, keyMap) {
  for (let key in states) {
    if (isObject(states[key])) {
      keyMap[key] = {
        _key: getOriginKey(key)
      }
      setKeyMap(states[key], keyMap[key])
    } else {
      keyMap[key] = getOriginKey(key)
    }
  }
}
/**
 * 获取原始键名
 * @param {string} key
 * @return {string}
 */
function getOriginKey (key) {
  return key.match(matchOriginKeyRE)[0]
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
    return makeCommentKey(key, comment)
  }
  return key
}
/**
 * 制作带有注释的键名
 * @param {string} key 键名
 * @param {string} comment 注释
 * @return {string}
 */
export function makeCommentKey (key, comment) {
  return `${key} (${comment})`
}
/**
 * 将时间遍历到目标上
 * @param {vm} 
 * @param {object} travelState 
 */
export function setStateFromTravel ($vm, travelState) {
  for (let key in travelState) {
    const currentState = travelState[key]
    if (isObject(currentState)) {
      // $vm[keyMap[key]._key] && setStateFromTravel($vm[keyMap[key]._key], travelState[key])
    } else {
      $vm[keyMap[key]] = travelState[key]
    }
  }
}