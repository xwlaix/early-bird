import request from '@/utils/request'

// 获取集团财务明细数据接口
export function getFinance(query, showLoading) {
  return request({
    url: `/finance/get/${query}`,
    method: 'get',
    showLoading
  })
}

// 新增集团财务数据接口
export function createFinance(data, showLoading) {
  return request({
    url: `/finance/create`,
    method: 'post',
    data,
    showLoading
  })
}

// 更新集团财务数据接口
export function updateFinance(data, showLoading) {
  return request({
    url: `/finance/update`,
    method: 'post',
    data,
    showLoading
  })
}

