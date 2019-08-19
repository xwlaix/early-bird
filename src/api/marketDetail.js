import request from '@/utils/request'

// 市场列表->活跃市场
export function market_act_list(params, showLoading) {
  return request({
    url: `/stat/market_act_list/`,
    method: 'get',
    params,
    showLoading
  })
}

// 新活跃市场
export function current_stat_list(params, showLoading) {
  return request({
    url: `/current/stat_list/`,
    method: 'get',
    params,
    showLoading
  })
}
// 开价动态
export function current_supplier_list(params, showLoading) {
  return request({
    url: `/current/supplier_list/`,
    method: 'get',
    params,
    showLoading
  })
}

// 应付漏斗
export function current_invoice_stat(params, showLoading) {
  return request({
    url: `/current/invoice_stat`,
    method: 'get',
    params,
    showLoading
  })
}
// 市场动态
export function marketStatDynamic(params, showLoading) {
  return request({
    url: `/market/stat/dynamic`,
    method: 'get',
    params,
    showLoading
  })
}
// 资金计划--资金计划清单
export function marketCashpoolPlan(params, showLoading) {
  return request({
    url: `/market/cashpool_plan/list`,
    method: 'get',
    params,
    showLoading
  })
}
// 资金计划--资金计划明细
export function marketCashpoolPlanDetail(params, showLoading) {
  return request({
    url: `/market/cashpool_plan/detail`,
    method: 'get',
    params,
    showLoading
  })
}
// 清算历史
export function marketHistoryList(params, showLoading) {
  return request({
    url: `/market/history/list`,
    method: 'get',
    params,
    showLoading
  })
}
// 供应商状态
export function supplierStat(query, showLoading) {
  return request({
    url: `/market/supplier/stat`,
    method: 'get',
    showLoading,
    params: query
  })
}
// 操作轨迹
export function marketOperation(query, showLoading) {
  return request({
    url: `/market/operation/`,
    method: 'get',
    showLoading,
    params: query
  })
}
// 开价监控
export function marketSupplierOffer(query, showLoading) {
  return request({
    url: `/market/supplier/offer`,
    method: 'get',
    showLoading,
    params: query
  })
}

// 发票信息
export function marketInvoiceList(query, showLoading) {
  return request({
    url: `/market/invoice/list`,
    method: 'get',
    showLoading,
    params: query
  })
}

// 供应商分析
export function current_supplier_log(params, showLoading) {
  return request({
    url: `/current/supplier_log`,
    method: 'get',
    params,
    showLoading
  })
}
// 供应商气泡图
export function supplier_scatter_life(params, showLoading) {
  return request({
    url: `/current/diagram/supplier_scatter_life`,
    method: 'get',
    params,
    showLoading
  })
}
// 清算漏斗堆积面积图
export function invoice_stacked_area(params, showLoading) {
  return request({
    url: `/current/diagram/invoice_stacked_area`,
    method: 'get',
    params,
    showLoading
  })
}
// 开价曲线
export function offer_step_line(params, showLoading) {
  return request({
    url: `/current/diagram/offer_step_line`,
    method: 'get',
    params,
    showLoading
  })
}
// 清算统计记录
export function market_stat_log(params, showLoading) {
  return request({
    url: `/current/market/stat_log`,
    method: 'get',
    params,
    showLoading
  })
}
// 饼图
export function supplier_nested_pie(params, showLoading) {
  return request({
    url: `/current/diagram/supplier_nested_pie`,
    method: 'get',
    params,
    showLoading
  })
}
// 清算记录供应商明细
export function history_supplier_detail(params, showLoading) {
  return request({
    url: `/market/history/supplier_detail`,
    method: 'get',
    params,
    showLoading
  })
}
// 清算记录应付明细
export function history_invoice_detail(params, showLoading) {
  return request({
    url: `/market/history/invoice_detail`,
    method: 'get',
    params,
    showLoading
  })
}
