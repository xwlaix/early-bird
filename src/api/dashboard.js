import request from '@/utils/request'

// dashboard运营数量
export function dashboardDetail() {
  return request({
    url: `/dashboard/detail`,
    method: 'get'
  })
}
