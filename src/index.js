
// vue-devtool 全局钩子函数
const devtoolHook =
  typeof window !== 'undefined' &&
  window.__VUE_DEVTOOLS_GLOBAL_HOOK__

const toString = Object.prototype.toString

const isObject = obj => toString.call(obj) === '[object Object]'

const store = {
  state: {},
  getters: {}
}
window.store = store

const comments = {}

/**
 * 初始化
 * @param {vm} $vm
 */
function create ($vm, devtoolHook) {
  store.state = getStates($vm)
  store.getters = getGetters($vm)
  devtoolHook.emit('vuex:init', store)
}
/**
 * 更新
 * @param {vm} $vm
 */
function update ($vm) {
  if ($vm.__replaceState) return false
  store.state = getStates($vm)
  store.getters = getGetters($vm)
  devtoolHook.emit('vuex:mutation', {
    type: 'UPDATE-DATA',
    // TODO: 以后最好加个 可以监测到是谁在变化
    payload: undefined
  })
}

function getFinalKey (key, path = '') {
  path += key
  const comment = getFinalComment(path.split('.'))
  if (comment !== '') {
    return `${key}(${comment})`
  }
  return key
}

function getFinalComment (paths) {
  if (paths.length === 1) {
    let comment = comments[paths[0]]
    return isObject(comment) ? comment._comment : comment || ''
  }

  let comment = ''
  let current = comments
  let i = 0
  while (++i) {
    console.log(current, paths, i)
    current = current[paths[i - 1]] || ''
    if (i === paths.length) break
  }

  return isObject(current) ? current._comment : current

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
    if (isObject($vm._data[key])) {
      states[getFinalKey(key, path)] = getStates({_data: $vm._data[key]}, path + key + '.')
    } else {
      states[getFinalKey(key, path)] = $vm._data[key]
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
    getters[getFinalKey(key)] = $vm.$options.computed[key].call($vm)
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

export default function ($vm, $comments) {
  if (devtoolHook && process.env.NODE_ENV !== 'production') {
    Object.assign(comments, $comments)

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