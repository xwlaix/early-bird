import request from '@/utils/request'

// 买家市场
export function buyer_market_list(params, showLoading) {
  return request({
    url: `/buyer_market/list/`,
    method: 'get',
    params,
    showLoading
  })
}
// 获取所有的市场编号和名称列表
export function group_market_list(params, showLoading) {
  return request({
    url: `/buyer_market/group_market_list`,
    method: 'get',
    params,
    showLoading
  })
}

// 买家市场->基础信息
export function buyer_market_read(params, showLoading) {
  return request({
    url: `/buyer_market/read`,
    method: 'get',
    params,
    showLoading
  })
}

// 买家市场->资金计划
export function cashpool_plan(params, showLoading) {
  return request({
    url: `/buyer_market/cashpool_plan`,
    method: 'get',
    params,
    showLoading
  })
}
// 买家市场->清算记录
export function clear_list(params, showLoading) {
  return request({
    url: `/buyer_market/clear_list`,
    method: 'get',
    params,
    showLoading
  })
}

// 买家市场->操作记录
export function market_operation(params, showLoading) {
  return request({
    url: `/buyer_market/market_operation`,
    method: 'get',
    params,
    showLoading
  })
}
// 买家市场->供应商动态
export function supplier_dynamic(params, showLoading) {
  return request({
    url: `/buyer_market/supplier_dynamic`,
    method: 'get',
    params,
    showLoading
  })
}
// 买家市场->市场动态
export function market_dynamic(params, showLoading) {
  return request({
    url: `/buyer_market/market_dynamic`,
    method: 'get',
    params,
    showLoading
  })
}
// 买家市场->逾期操作
export function overdue(params, showLoading) {
  return request({
    url: `/buyer_market/overdue`,
    method: 'get',
    params,
    showLoading
  })
}

// 客户市场->开价监控
export function supplierOffer(params, showLoading) {
  return request({
    url: `/market/supplier/offer`,
    method: 'get',
    params,
    showLoading
  })
}

