import request from '@/utils/request'

// 读取用户列表
export function getUser(query, showLoading) {
  return request({
    url: `/rest/user/list/${query}`,
    method: 'get',
    showLoading
  })
}

// 读取买家用户的具体信息
export function getBuyer(query, showLoading) {
  return request({
    url: `/rest/user/get_buyer/${query}`,
    method: 'get',
    showLoading
  })
}

// 读取买家公司列表信息
export function getCompany(query, showLoading) {
  return request({
    url: `/rest/user/company_list/${query}`,
    method: 'get',
    showLoading
  })
}
// 读取买家市场列表信息
export function getMarket(query, showLoading) {
  return request({
    url: `/rest/user/buyer/market_list/${query}`,
    method: 'get',
    showLoading
  })
}
// 获取卖家用户的具体信息
export function getVendor(query, showLoading) {
  return request({
    url: `/rest/user/get_vendor/${query}`,
    method: 'get',
    showLoading
  })
}
// 获取卖家市场列表信息
export function getVendorMarket(query, showLoading) {
  return request({
    url: `/rest/user/vendor/market_list/${query}`,
    method: 'get',
    showLoading
  })
}

// 获取登陆日志
export function login_list(data, showLoading) {
  return request({
    url: `/rest/user/login_list`,
    method: 'post',
    data,
    showLoading
  })
}
