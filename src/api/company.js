import request from '@/utils/request'

// 读取集团下的公司列表
export function getCompany(query, showLoading) {
  return request({
    url: `/company/list/${query}`,
    method: 'get',
    showLoading
  })
}

// 编辑公司初始化数据接口
export function addCompanyData(query, showLoading) {
  return request({
    url: `/company/get/${query}`,
    method: 'get',
    showLoading
  })
}

// 添加公司表单提交
export function createCompany(data, showLoading) {
  return request({
    url: `/company/create`,
    method: 'post',
    data,
    showLoading
  })
}

// 更新公司表单提交
export function updateCompany(data, showLoading) {
  return request({
    url: `/company/update`,
    method: 'post',
    data,
    showLoading
  })
}

// 删除集团
export function deleteCompany(data, showLoading) {
  return request({
    url: `/company/delete`,
    method: 'post',
    data,
    showLoading
  })
}

// 读取公司的secret
export function getTokenCompany(query, showLoading) {
  return request({
    url: `/company/gettoken/${query}`,
    method: 'get',
    showLoading
  })
}

// 刷新公司的secret
export function flushkeyCompany(query, showLoading) {
  return request({
    url: `/company/flushkey/${query}`,
    method: 'get',
    showLoading
  })
}

