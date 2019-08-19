import request from '@/utils/request'

// 资金跟踪->活跃市场
export function fund_activity_list(params, showLoading) {
  return request({
    url: `/fund/activity_list/`,
    method: 'get',
    params,
    showLoading
  })
}
// 资金跟踪->非活跃市场
export function fund_un_activity_list(params, showLoading) {
  return request({
    url: `/fund/un_activity_list/`,
    method: 'get',
    params,
    showLoading
  })
}
// 资金跟踪->历史分配明细统计
export function fund_history_count(params, showLoading) {
  return request({
    url: `/fund/history_count`,
    method: 'get',
    params,
    showLoading
  })
}

// 资金跟踪->历史分配明细
export function fund_history_detail(params, showLoading) {
  return request({
    url: `/fund/history_detail`,
    method: 'get',
    params,
    showLoading
  })
}
// 资金跟踪->资金分配供应商明细
export function fund_supplier_list(params, showLoading) {
  return request({
    url: `/fund/supplier_list`,
    method: 'get',
    params,
    showLoading
  })
}
// 资金跟踪->资金分配应付票据明细
export function fund_payward_list(params, showLoading) {
  return request({
    url: `/fund/payward_list`,
    method: 'get',
    params,
    showLoading
  })
}

// 资金跟踪->资金分配清算明细
export function fund_clear_list(params, showLoading) {
  return request({
    url: `/fund/clear_list`,
    method: 'get',
    params,
    showLoading
  })
}
// 资金跟踪->列表
export function cashpool_plan(params, showLoading) {
  return request({
    url: `/fund/cashpool_plan`,
    method: 'get',
    params,
    showLoading
  })
}
