import axios from 'axios'
import { MessageBox, Message, Loading } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import qs from 'qs'
let needLoadingRequestCount = 0
const loadingArray = []
let loading
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000, // 请求超时时间
  headers: {
    'Cache-Control': 'no-cache'
  }
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    if (store.getters.authKey || store.getters.sessionId) {
      config.headers['authKey'] = getToken('authKey')
      config.headers['sessionId'] = getToken('sessionId')
    }
    if (config.showLoading) {
      showLoading(config.showLoading, config.url)
    }
    if (config.data) {
      config.data = qs.stringify(config.data)
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const url = response.request.responseURL
    const res = response.data
    if (response.config.showLoading) {
      tryHideLoading(url)
    }
    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 200 && res.code !== 1) {
      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 101) {
        // to re-login
        MessageBox.confirm(
          '你已被登出，可以取消继续留在该页面，或者重新登录',
          '确定登出',
          {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      } else {
        Message({
          message: res.error || res.msg || '接口处理失败',
          type: 'error',
          duration: 1000
        })
      }
      return Promise.reject(new Error(res.error || res.msg || '接口处理失败' || 'Error'))
    } else {
      try {
        if (response.data.data.list && response.data.data.list.length > 0 || response.data.data.length > 0) {
          (response.data.data.length > 0 ? response.data.data : response.data.data.list).filter((v, i) => {
            for (const [key, value] of Object.entries(v)) {
              if (!value && value !== 0) {
                v[key] = '--'
              }
            }
          })
        }
      } catch (err) {
        console.log(err)
      }
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 1.5 * 1000
    })
    if (error.config.showLoading) {
      tryHideLoading(error.config.url)
    }
    return Promise.reject(error)
  }
)
function showLoading(Selector, url) {
  startLoading(Selector, url)
  needLoadingRequestCount++
}

function tryHideLoading(url) {
  if (needLoadingRequestCount > 0) {
    needLoadingRequestCount--
    tryCloseLoading(url)
  }
}

function startLoading(Selector, url) {
  loading = Loading.service({
    target: document.querySelector(Selector)
  })
  loadingArray.push({ url, loading })
}
function tryCloseLoading(url) {
  for (const item of loadingArray) {
    if (url.replace(window.location.origin, '').replace('/api', '') === item.url ||
    url.replace(window.location.origin, '').replace('/api', '').split('?')[0] === item.url.split('?')[0] ||
    url.replace(window.location.origin, '').replace('/dev-api', '') === item.url ||
    url.replace(window.location.origin, '').replace('/dev-api', '').split('?')[0] === item.url.split('?')[0] ||
     url.replace(window.location.origin, '').split('?')[0] === item.url.split('?')[0]
    ) {
      setTimeout(() => {
        const index = loadingArray.indexOf(item)
        item.loading.close()
        loadingArray.splice(index, 1)
      }, 200)
    }
  }
}
export default service
