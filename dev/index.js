import Vue from 'vue/dist/vue.esm.js'
import devtools from '../src/index'

process.env.NODE_ENV = 'development'

const bus = new Vue({
  data () {
    return {
      i: 0,
      for: {
        bar: false,
        for: {
          bar: 123
        }
      }
    }
  },
  computed: {
    num () {
      return this.i + '次'
    },
    forbar () {
      const forbar = this.for.bar
      return forbar ? '是' : '否'
    }
  }
})
window.bus = bus
let open = true
setInterval(() => {
  if (bus.i < 5 && open) {
    bus.i ++
  } else {
    open = false
  }
}, 300)

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
  forbar: 'computed forbar'
}

devtools(bus, comments)

new Vue({
  el: '#app',
  computed: {
    num () {
      return bus.num
    }
  }
})