// vue-devtool 全局钩子函数
export const devtoolHook =
  typeof window !== 'undefined' &&
  window.__VUE_DEVTOOLS_GLOBAL_HOOK__

export default devtoolHook