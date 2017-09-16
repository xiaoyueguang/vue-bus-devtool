# vue-bus-event
更好的在 vue-devtools 中调试 vue bus

当应用变得很大时, 我们可能会引用 `Vuex` 来进行状态整理, 在`vue-devtools`上可以很清楚的看到`vuex`的各项数据以及突变.

然而有些人会因为仅需将部分数据共享出来, 通过实例化一个 `vue`, 取得新的实例, 将数据交由该实例进行管理. 采用这种方式, 查看他们的数据会比较困难. 因此制作了这个工具来实现 通过`vue-devtool`来观察这种方式的数据.

## 开始
```
import devtool from './bus-devtool'

const bus = new Vue({
  data () {
    return {
      text: 'World'
    }
  },
  computed: {
    msg () {
      return `Hello ${this.text}!`
    }
  }
})

devtool(bus)
```