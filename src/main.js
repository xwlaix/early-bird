// import '@babel/polyfill'
import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import './styles/element-variables.scss'

import '@/styles/index.scss' // global css
import { debounce } from '@/utils'
import axios from 'axios'

import App from './App'
import store from './store'
import router from './router'

import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log
import permission from '@/directive/permission/index.js'
Vue.use(permission)
import * as filters from './filters' // global filters
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/zh-CN'

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */
// import { mockXHR } from '../mock'
// if (process.env.NODE_ENV === 'production') {
//   mockXHR()
// }
Vue.use(ElementUI, { locale, size: Cookies.get('size') || 'medium' })

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
const getToken = debounce(() => {
  const config = {
    headers: {
      'authKey': Cookies.get('authKey'),
      'sessionId': Cookies.get('sessionId')
    }
  }
  axios.get(process.env.VUE_APP_BASE_API + '/admin/base/flush_token', config)
}, 60000)
window.addEventListener('click', getToken)
