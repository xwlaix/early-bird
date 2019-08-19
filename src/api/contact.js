import request from '@/utils/request'

// 读取集团下的联系人列表
export function contactList(query, showLoading) {
  return request({
    url: `/contact/list/${query}`,
    method: 'get',
    showLoading
  })
}

// 获取联系人明细数据接口
export function getContactData(query, showLoading) {
  return request({
    url: `/contact/get/${query}`,
    method: 'get',
    showLoading
  })
}

// 新增联系人数据接口
export function createContact(data, showLoading) {
  return request({
    url: `/contact/create`,
    method: 'post',
    data,
    showLoading
  })
}

// 更新联系人表单提交
export function updateContact(data, showLoading) {
  return request({
    url: `/contact/update`,
    method: 'post',
    data,
    showLoading
  })
}
// 更新联系人表单提交
export function activateContact(data, showLoading) {
  return request({
    url: `/contact/activate`,
    method: 'post',
    data,
    showLoading
  })
}

// 禁用启用联系人
export function deleteContact(data, showLoading) {
  return request({
    url: `/contact/enables`,
    method: 'post',
    data,
    showLoading
  })
}

// 获取该集团下可用被授权的联系人邮箱列表
export function simpleListContact(query, showLoading) {
  return request({
    url: `/contact/simplelist/${query}`,
    method: 'get',
    showLoading
  })
}

// 获取集团清算负责人以及授权邮箱接口
export function getChargeContact(query, showLoading) {
  return request({
    url: `/contact/getCharge/${query}`,
    method: 'get',
    showLoading
  })
}

