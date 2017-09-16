const devtoolHook =
  typeof window !== 'undefined' &&
  window.__VUE_DEVTOOLS_GLOBAL_HOOK__

/**
 * 执行 更新 vue-devtools 的 vuex 模块
 * @param {vm} $vm 传入的 BUS
 * @param {devtool} devtoolHook vue-devtool钩子函数
 */
function exec ($vm, devtoolHook) {
  const state = $vm._data
  const getters = {}

  for (let key in $vm.$options.computed) {
    getters[key] = $vm.$options.computed[key].call($vm)
  }

  const store = {
    state,
    getters
  }
  devtoolHook && devtoolHook.emit('vuex:init', store)
}

export default function ($vm) {

  if (devtoolHook && process.env.NODE_ENV !== 'production') {
    $vm.$watch(function () { return $vm._data }, () => {
      setTimeout(() => {
        exec($vm, devtoolHook)
      })
    }, {
      deep: true,
      sync: true
    })
  }
}

