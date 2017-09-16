import Vue from 'vue/dist/vue.esm.js'
import devtools from '../src/index'

process.env.NODE_ENV = 'development'

const bus = new Vue({
  data () {
    return {
      i: 0,
      test: {
        test: false,
        for: {
          bar: 123
        }
      }
    }
  },
  computed: {
    // num () {
    //   return this.i + '次'
    // },
    // testMsg () {
    //   const test = this.test.test
    //   return test ? '是' : '否'
    // }
  }
})
window.bus = bus
let open = true
// setInterval(() => {
//   if (bus.i < 5 && open) {
//     bus.i ++
//   } else {
//     open = false
//   }
// }, 300)

const comments = {
  i: '计数'
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