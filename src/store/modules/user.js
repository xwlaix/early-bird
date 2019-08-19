import { login, logout } from '@/api/login'
import { menu_list } from '@/api/stageuser'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import headImg from '@/assets/image/headImg.gif'

const state = {
  authKey: getToken('authKey'),
  sessionId: getToken('sessionId'),
  name: '',
  avatar: '',
  introduction: '',
  roles: []
}

const mutations = {
  SET_TOKEN: (state, data) => {
    state.authKey = data.authKey
    state.sessionId = data.sessionId
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password, verifyCode } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password, verifyCode: verifyCode }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data)
        setToken('authKey', data.authKey)
        setToken('sessionId', data.sessionId)
        commit('SET_NAME', data.userInfo.realname)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      commit('SET_AVATAR', headImg)
      menu_list().then(response => {
        const { data } = response
        if (!response) {
          reject('Verification failed, please Login again.')
        }
        // roles must be a non-empty array
        if (!data || data.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }

        commit('SET_ROLES', data)
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', {})
        commit('SET_ROLES', [])
        removeToken('authKey')
        removeToken('sessionId')
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken('authKey')
      removeToken('sessionId')
      resolve()
    })
  },

  // dynamically modify permissions // TODO: need changeRoles
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
