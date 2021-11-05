import { createStore } from "vuex";

export default createStore({
  state() {
    return {
      role: "",
      personMessage: {},
    };
  },
  mutations: {
    setRole(state, value) {
      state.role = value;
    },
    setPersonMessage(state, value) {
      state.personMessage = value;
    },
  },
  actions: {},
  getters: {
    getRole(state) {
      return state.role;
    },
    getPersonMessage(state) {
      return state.personMessage;
    },
  },
  modules: {},
});
