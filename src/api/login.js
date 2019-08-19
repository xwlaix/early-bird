import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/admin/base/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/admin/base/logout',
    method: 'post'
  })
}

export function setInfo(data) {
  return request({
    url: '/admin/base/setInfo',
    method: 'post',
    data
  })
}
