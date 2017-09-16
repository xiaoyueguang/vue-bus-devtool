
// vue-devtool 全局钩子函数
const devtoolHook =
  typeof window !== 'undefined' &&
  window.__VUE_DEVTOOLS_GLOBAL_HOOK__

const store = {
  state: {},
  getters: {}
}

/**
 * 初始化
 * @param {vm} $vm
 */
function create ($vm, devtoolHook) {
  store.state = $vm._data
  store.getters = getGetters($vm)
  devtoolHook.emit('vuex:init', store)
}
/**
 * 更新
 * @param {vm} $vm
 */
function update ($vm) {
  if ($vm.__replaceState) return false
  store.getters = getGetters($vm)
  devtoolHook.emit('vuex:mutation', {type: 'UPDATE-DATA', payload: undefined}, {})
}

/**
 * 获取对应的 getters
 * @param {vm} $vm
 */
function getGetters ($vm) {
  const getters = {}
  for (let key in $vm.$options.computed) {
    getters[key] = $vm.$options.computed[key].call($vm)
  }
  return getters
}
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
      $vm[key] = targetState[key]
    }
    $vm.__replaceState = false
  })
}

export default function ($vm) {
  if (devtoolHook && process.env.NODE_ENV !== 'production') {
    delay(() => create($vm, devtoolHook))

    openTravel($vm)

    $vm.$watch(function () { return $vm._data }, () => {
      update($vm, devtoolHook)
    }, {
      deep: true,
      sync: true
    })
  }
}

function delay (fn) {
  setTimeout(fn)
}