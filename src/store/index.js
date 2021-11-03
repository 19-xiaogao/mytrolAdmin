import { createStore } from "vuex";

export default createStore({
  state() {
    return {
      role: 0,
    };
  },
  mutations: {
    setRole(state, value) {
      state.role = value;
    },
  },
  actions: {},
  getters: {
    getRole(state) {
      return state.role;
    },
  },
  modules: {},
});
