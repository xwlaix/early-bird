import request from '@/utils/request'

// 获取节假日
export function getHoliday(year, showLoading) {
  return request({
    url: `http://timor.tech/api/holiday/year/${year || ''}`,
    method: 'get',
    showLoading
  })
}
// 获取万年历
export function getYear(year, showLoading) {
  return request({
    url: `http://www.mxnzp.com/api/holiday/list/year/${year || new Date().getFullYear()}`,
    method: 'get',
    showLoading
  })
}
// 读取开始日期列表
export function calenarList(data, showLoading) {
  return request({
    url: `/market/calendar/list`,
    method: 'post',
    data,
    showLoading
  })
}
// 获取一年内的节假日接口
export function calenarHoliday(data, showLoading) {
  return request({
    url: `/market/calendar/holiday`,
    method: 'post',
    data,
    showLoading
  })
}
// 获取一年内的节假日接口
export function calenarUpdate(data, showLoading) {
  return request({
    url: `/market/calendar/update`,
    method: 'post',
    data,
    showLoading
  })
}
