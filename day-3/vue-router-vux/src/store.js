import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    name:'zf'
  },
  mutations: {
    setUsername(state){
      state.name = 'zf 1'
    }
  },
  actions: {
    setUsername(s){
      console.log(s)
      setTimeout(()=>{
        s.commit('setUsername')
      },1000)
    }
  }
})
