import request from '@/utils/request'

// 读取api日志列表
export function api_record(params, showLoading) {
  return request({
    url: `/api_record/list`,
    method: 'get',
    params,
    showLoading
  })
}
export function feedback(params, showLoading) {
  return request({
    url: '/feedback/list',
    method: 'get',
    params,
    showLoading
  })
}
