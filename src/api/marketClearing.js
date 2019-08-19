import request from '@/utils/request'

// 每日清算
export function market_clear_list(params, showLoading) {
  return request({
    url: `/market_clear/list/`,
    method: 'get',
    params,
    showLoading
  })
}
// 发票明细
export function payward_list(params, showLoading) {
  return request({
    url: `/market_clear/payward_list/`,
    method: 'get',
    params,
    showLoading
  })
}
// 付款监控
export function pay_monitor(params, showLoading) {
  return request({
    url: `/market_clear/pay_monitor/`,
    method: 'get',
    params,
    showLoading
  })
}
