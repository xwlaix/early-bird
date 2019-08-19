import request from '@/utils/request'

// 集团列表
export function getGroup(query, showLoading) {
  return request({
    url: `/group/list/page/${query.page}/size/${query.size}`,
    method: 'get',
    showLoading,
    params: query
  })
}

// 集团初始化数据接口
export function addGroupData(query, showLoading) {
  return request({
    url: `/group/get/${query}`,
    method: 'get',
    showLoading
  })
}

// 添加集团表单提交
export function createGroup(data, showLoading) {
  return request({
    url: `/group/create`,
    method: 'post',
    data,
    showLoading
  })
}

// 更新集团表单提交
export function updateGroup(data, showLoading) {
  return request({
    url: `/group/update`,
    method: 'post',
    data,
    showLoading
  })
}

// 删除集团
export function deleteGroup(data, showLoading) {
  return request({
    url: `/group/delete`,
    method: 'post',
    data,
    showLoading
  })
}

// 批量删除集团
export function deletesGroup(data, showLoading) {
  return request({
    url: `/group/deletes`,
    method: 'post',
    data,
    showLoading
  })
}

// 管理集团数据接口
export function showGroup(query, showLoading) {
  return request({
    url: `/group/show/${query}`,
    method: 'get',
    showLoading
  })
}

// 集团激活接口
export function activeGroup(query, showLoading) {
  return request({
    url: `/group/active/${query}`,
    method: 'get',
    showLoading
  })
}
// 销售列表
export function seller_list() {
  return request({
    url: `/admin/users/seller_list`,
    method: 'get'
  })
}
// 获取市场列表
export function get_market(data, showLoading) {
  return request({
    url: '/search/get_market',
    method: 'post',
    data,
    showLoading
  })
}
// 集团列表
export function get_group(query, showLoading) {
  return request({
    url: `/group/list/`,
    method: 'get',
    showLoading,
    params: query
  })
}
// 供应商列表
export function get_supplier(data, showLoading) {
  return request({
    url: `/search/get_supplier/`,
    method: 'post',
    showLoading,
    data
  })
}

