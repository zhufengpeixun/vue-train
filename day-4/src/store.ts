import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
import {ITodo} from './types/todo';

interface IList {
  lists: ITodo[];
}

export default new Vuex.Store<IList>({
  state: {
    lists: [ // 数据
      {text: '睡觉', complete: true},
      {text: '吃饭', complete: false},
    ],
  },
  mutations: {
    hello() {
      console.log(12222);
    },
  },
  actions: {

  },
});
