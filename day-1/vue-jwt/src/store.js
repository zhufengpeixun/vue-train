import Vue from 'vue';
import Vuex from 'vuex';
import { login, validate } from './api';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    username: '',
  },
  mutations: {
    setUsername(state, username) {
      state.username = username;
    },
  },
  actions: {
    async validate({ commit }) {
      const r = await validate();
      if (r.code === 1) {
        return false;
      }
      commit('setUsername', r.username);
      localStorage.setItem('token', r.token);
      return true;
    },
    async login({ commit }, username) {
      const r = await login(username);
      if (r.code === 1) {
        return Promise.reject(r);
      }
      localStorage.setItem('token', r.token);
      commit('setUsername', r.username);
    },
  },
});
