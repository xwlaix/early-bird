import request from '@/utils/request'

// 获取所有的hash值
export function hash_list(showLoading) {
  return request({
    url: `/current/hash_list`,
    method: 'get',
    showLoading
  })
}
// 获取今日市场统计列表
export function currentList(data, showLoading) {
  return request({
    url: `/current/stat_list`,
    data,
    method: 'post',
    showLoading
  })
}
// 获取今日市场动态列表
export function currentMarketList(query, showLoading) {
  return request({
    url: `/current/market_list/${query.market_id}/page/${query.page}/size/${query.size}`,
    method: 'get',
    showLoading
  })
}
// 获取供应商动态明细列表
export function currentSupplierList(query, showLoading) {
  return request({
    url: `/current/supplier_list/${query.list_id}/page/${query.page}/size/${query.size}`,
    method: 'get',
    showLoading
  })
}
