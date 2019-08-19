import request from '@/utils/request'

// 读取公司下的市场列表
export function marketList(query, showLoading) {
  return request({
    url: `/market/list/${query}`,
    method: 'get',
    showLoading
  })
}

// 添加市场信息
export function createMarket(data, showLoading) {
  return request({
    url: `/market/create`,
    method: 'post',
    data,
    showLoading
  })
}

// 读取市场信息接口
export function getMarket(query, showLoading) {
  return request({
    url: `/market/get/${query}`,
    method: 'get',
    showLoading
  })
}

// 编辑市场信息
export function updateMarket(data, showLoading) {
  return request({
    url: `/market/update`,
    method: 'post',
    data,
    showLoading
  })
}

// 禁用启用市场数据接口
export function deleteMarket(data, showLoading) {
  return request({
    url: `/market/enables`,
    method: 'post',
    data,
    showLoading
  })
}

// 货币信息基础数据
export function currencyList(showLoading) {
  return request({
    url: `/currency/list`,
    method: 'get',
    showLoading
  })
}

