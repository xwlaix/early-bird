import request from '@/utils/request'

// 漏斗列表
export function all_hopper_list(params, showLoading) {
  return request({
    url: `/current/all_hopper_list`,
    method: 'get',
    params,
    showLoading
  })
}
// 1层按钮
export function detail_hopper_list(params, showLoading) {
  return request({
    url: `/current/detail_hopper_list`,
    method: 'get',
    params,
    showLoading
  })
}
// 2层按钮
export function valid_hopper_list(params, showLoading) {
  return request({
    url: `/current/valid_hopper_list`,
    method: 'get',
    params,
    showLoading
  })
}

// 3,4,5层
export function all_award_list(params, showLoading) {
  return request({
    url: `/current/all_award_list`,
    method: 'get',
    params,
    showLoading
  })
}
