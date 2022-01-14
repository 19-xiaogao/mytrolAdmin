import { createStore } from "vuex";

export default createStore({
    state() {
        return {
            user: {},
            personMessage: {},
            loading: false,
        };
    },
    mutations: {
        setUser(state, value) {
            state.user = value;
        },
        setPersonMessage(state, value) {
            state.personMessage = value;
        },
        setLoading(state, value) {
            state.loading = value;
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
        getLoading(state) {
            return state.loading;
        },
    },
    modules: {},
});
