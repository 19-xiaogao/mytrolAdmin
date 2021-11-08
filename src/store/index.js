import { createStore } from "vuex";

export default createStore({
  state() {
    return {
      user: {},
      personMessage: {},
    };
  },
  mutations: {
    setUser(state, value) {
      state.user = value;
    },
    setPersonMessage(state, value) {
      state.personMessage = value;
    },
  },
  actions: {},
  getters: {
    getUser(state) {
      return state.user;
    },
    getPersonMessage(state) {
      return state.personMessage;
    },
  },
  modules: {},
});
