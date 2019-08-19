
const state = {
  stat_list: [],
  hash_list: [],
  timer: '',
  market_code: '',
  market_status: '',
  company_status: ''
}
const mutations = {
  SET_STAT_LIST: (state, stat_list) => {
    state.stat_list = stat_list
  },
  SET_HASH_LIST: (state, hash_list) => {
    state.hash_list = hash_list
  },
  SET_TIMER: (state, timer) => {
    if (!timer && state.tiemr) {
      clearInterval(state.timer)
    }
    state.timer = timer
  },
  SET_MARKET_CODE: (state, market_code) => {
    state.market_code = market_code
  },
  SET_MARKET_STATUS: (state, market_status) => {
    state.market_status = market_status
  },
  SET_COMPANY_STATUS: (state, company_status) => {
    state.company_status = company_status
  }
}
const actions = {
  setStatList({ commit }, stat_list) {
    commit('SET_STAT_LIST', stat_list)
  },
  setHashList({ commit }, hash_list) {
    commit('SET_HASH_LIST', hash_list)
  },
  setTimer({ commit }, timer) {
    commit('SET_TIMER', timer)
  },
  setMarketCode({ commit }, market_code) {
    commit('SET_MARKET_CODE', market_code)
  },
  setMarketStatus({ commit }, market_status) {
    commit('SET_MARKET_STATUS', market_status)
  },
  setMCompanytStatus({ commit }, company_status) {
    commit('SET_COMPANY_STATUS', company_status)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
