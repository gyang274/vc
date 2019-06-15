import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import io from 'socket.io-client'

export default new Vuex.Store({
  state () {
    // set `/server` proxy in vue.config.js
    // const socket = io('http://127.0.0.1:3000', { 
    //   autoConnect: true 
    // })
    const socket = io()
    return {
      socket: socket,
      user: {
        name: '',
        room: '',
        seat: -1
      }
    }
  },
  getters: {
    // eslint-disable-next-line
    socket: (state, getters) => {
      return state.socket
    },
    // eslint-disable-next-line
    user: (state, getters) => {
      return state.user
    }
  },
  mutations: {
    setUserAttr: (state, payload) => {
      for (let [k, v] of Object.entries(payload)) {
        state.user[k] = v
      }
    }
  },
  actions: {
    setUserAttr: (context, payload) => {
      context.commit('setUserAttr', payload)
    }
  },
})
