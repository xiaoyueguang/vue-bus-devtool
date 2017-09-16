import Vue from 'vue/dist/vue.esm.js'
import devtools from '../src/index'

process.env.NODE_ENV = 'development'

const bus = new Vue({
  data () {
    return {
      i: 0
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
  } else {
    open = false
  }
}, 300)

devtools(bus)

new Vue({
  el: '#app',
  computed: {
    num () {
      return bus.num
    }
  }
})