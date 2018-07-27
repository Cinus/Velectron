import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import router from '../router/index'
import createPersistedState from 'vuex-persistedstate'
import * as Cookies from 'js-cookie'

Vue.use(Vuex)
// axios.defaults.headers.common['Content-type'] = 'application/json'

const baseURL = 'https://inpyh4yg41.execute-api.ap-northeast-2.amazonaws.com/default'

const doAction = ({state, commit}, method, path, params, option) => {
    let headers = {
        'Content-type': 'application/json',
        'x-api-key': 'B9hDHR6R0E3kZf0bNhEnF6PgVnoz5w8i9mM0A2JW'
    }
    if (state.user && state.user.loginToken) {
        // headers['x-api-key'] = 'B9hDHR6R0E3kZf0bNhEnF6PgVnoz5w8i9mM0A2JW'
    }
    return new Promise((resolve, reject) => {
        let conf = {
            method: method,
            url: `${baseURL}/${path}`,
            data: params,
            headers: headers
        }
        if (option && option.responseType) {
            conf.responseType = option.responseType
        }
        state.fetching += 1
        axios(conf).then((response) => {
            state.fetching -= 1
            if (option) {
                if (option.success) option.success(response)
                if (option.commit) commit(option.commit, response.data)
                if (option.push) {
                    if (typeof option.push === 'string') {
                        router.push({name: option.push})
                    } else {
                        router.push(option.push)
                    }
                }
            }
            resolve(response)
        }).catch(e => {
            if (option && option.error) option.error(e)
            resolve(e.response)
            console.log('Error: ', e)
        })
    })
}
Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        user: {},
        userList: []
    },
    actions: {
        signin ({ commit }, params) {
            const error = (e) => {
                if (e.response.status === 401) {
                    Vue.swal('Error', 'Invalid ID or Password!', 'error')
                } else {
                    console.log('Error: ', e)
                }
            }

            return doAction(this, 'post', 'signin/', params, { commit: 'DO_LOGIN', error })
        },
        signup ({ commit }, params) {
            return doAction(this, 'post', 'users/', params, {})
        },
        getUserList ({ commit }) {
            return doAction(this, 'get', 'users/', {}, { commit: 'GET_USER_LIST' })
        },
        logout ({ commit }) {
            commit('DO_LOGOUT')
        }
    },
    mutations: {
        DO_LOGIN: (state, data) => {
            state.user.loginToken = data.token
            state.user.isAuthenticated = true
            state.user.id = data.user.id
            state.user.email = data.user.email
            state.user.username = data.user.username
            state.user.is_staff = data.user.is_staff
        },
        DO_LOGOUT: (state, data) => {
            state.user = {}
        },
        GET_USER_LIST: (state, data) => {
            state.userList = data.Items
        }
    },
    plugins: [
        createPersistedState({
            paths: ['user'],
            getState: (key) => Cookies.getJSON(key),
            setState: (key, state) => Cookies.set(key, state, { expires: 1, secure: false })
        })
    ]
})
