import Vue from 'vue/dist/vue.esm.js'
import devtool from '../src/index'

process.env.NODE_ENV = 'development'

const bus = new Vue({
  data () {
    return {
      i: 0,
      for: {
        bar: false,
        for: {
          bar: 123,
          items: ['子item 0']
        }
      },
      items: [0]
    }
  },
  computed: {
    num () {
      return this.i + '次'
    }
  }
})
window.bus = bus
let open = true
setInterval(() => {
  if (bus.i < 5 && open) {
    bus.i ++
    bus.for.bar = bus.i % 2 === 0
    bus.for.for.bar = Math.random().toString().substr(3, 2)
    Math.random() > 0.2 && bus.items.push(bus.items.length)
    Math.random() > 0.2 && bus.for.for.items.push(`子item ${bus.items.length}`)
  } else {
    open = false
  }
}, 100)

const comments = {
  i: '计数',
  num: '次数',
  for: {
    _comment: '第一层for',
    bar: '第二层bar',
    for: {
      _comment: '第二层for',
      bar: '第三层bar'
    }
  },
  items: '列表数据'
}

if (Math.random() > 0.5) comments.for._comment = null
if (Math.random() > 0.5) comments.for.for.bar = null

// devtool(bus, comments)
Vue.use(devtool, {
  vm: bus,
  comments
})

window.vm = new Vue({
  el: '#app'
})