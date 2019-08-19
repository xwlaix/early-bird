import request from '@/utils/request'

// 读取邮箱模板列表
export function listTemplates(params, showLoading) {
  return request({
    url: `/email_templates/list`,
    method: 'get',
    params,
    showLoading
  })
}
// 读取邮件模板数据接口
export function getTemplates(id, showLoading) {
  return request({
    url: `/email_templates/get/${id}`,
    method: 'get',
    showLoading
  })
}
// 新增邮件模板接口
export function createTemplates(data, showLoading) {
  return request({
    url: `/email_templates/create`,
    method: 'post',
    data,
    showLoading
  })
}
// 更新邮件模板接口
export function updateTemplates(data, showLoading) {
  return request({
    url: `/email_templates/update`,
    method: 'post',
    data,
    showLoading
  })
}
// 删除邮件模板数据接口
export function deleteTemplates(data, showLoading) {
  return request({
    url: `/email_templates/delete`,
    method: 'post',
    data,
    showLoading
  })
}
// 邮件发送日志列表
export function listLogs(data, showLoading) {
  return request({
    url: `/email_logs/list/page/${data.page}/size/${data.size}`,
    method: 'get',
    params: data,
    showLoading
  })
}
// 读读取邮件发送日志
export function getlog(id, showLoading) {
  return request({
    url: `/email_logs/get/${id}`,
    method: 'get',
    showLoading
  })
}
