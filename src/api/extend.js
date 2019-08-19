import request from '@/utils/request'

// 获取集团扩展信息明细接口
export function getExtend(query, showLoading) {
  return request({
    url: `/extend/get/${query}`,
    method: 'get',
    showLoading
  })
}

// 新增集团扩展数据接口
export function createExtend(data, showLoading) {
  return request({
    url: `/extend/create`,
    method: 'post',
    data,
    showLoading
  })
}

// 更新扩展信息
export function updateExtend(data, showLoading) {
  return request({
    url: `/extend/update`,
    method: 'post',
    data,
    showLoading
  })
}

