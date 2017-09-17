import {
  delay,
  toString,
  isObject
} from './helper'

import devtoolHook from './devtool'

import {
  store,
  updateStore,
  keyMap
} from './store'

import {_comments} from './comments'

/**
 * 初始化
 * @param {vm} $vm
 */
function create ($vm) {
  updateStore(store, $vm)
  devtoolHook.emit('vuex:init', store)
}
/**
 * 更新
 * @param {vm} $vm
 */
function update ($vm) {
  if ($vm.__replaceState) return false
  delay(() => {
    updateStore(store, $vm)

    devtoolHook.emit('vuex:mutation', {
      type: 'UPDATE-DATA',
      // TODO: 以后最好加个 可以监测到是谁在变化
      payload: undefined
    })
  })
}

window.keyMap = keyMap
/**
 * 开启时间旅行
 * @param {vm} $vm
 */
function openTravel ($vm) {
  devtoolHook.on('vuex:travel-to-state', targetState => {
    // 是否替换
    $vm.__replaceState = true
    // 替换 state来实现时间旅行
    for (let key in targetState) {
      $vm[keyMap[key]] = targetState[key]
    }
    $vm.__replaceState = false
  })
}

export default {
  install (Vue, {vm, comments}) {
    // 检测$bus 是否被占用. 并自动将 vm 附加到$bus 上
    !Vue.prototype.$bus && (Vue.prototype.$bus = vm)
    if (devtoolHook && process.env.NODE_ENV !== 'production') {
      Object.assign(_comments, comments)
  
      delay(() => create(vm))
  
      openTravel(vm)
  
      vm.$watch(function () { return vm._data }, () => {
        update(vm)
      }, {
        deep: true,
        sync: true
      })
    }
  }
}
