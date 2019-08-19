import request from '@/utils/request'

// 读取用户列表
export function usersList(params, showLoading) {
  return request({
    url: `/admin/users/`,
    method: 'get',
    params,
    showLoading
  })
}
// 新增用户
export function usersSave(data, showLoading) {
  return request({
    url: `/admin/users/create`,
    method: 'post',
    data,
    showLoading
  })
}
// 修改用户
export function usersUpdate(data, showLoading) {
  return request({
    url: `/admin/users/update`,
    method: 'post',
    data,
    showLoading
  })
}
// 禁用用户
export function usersEnables(data, showLoading) {
  return request({
    url: `/admin/users/enables`,
    method: 'post',
    data,
    showLoading
  })
}
// 角色列表
export function groups(params, showLoading) {
  return request({
    url: `/admin/groups`,
    method: 'get',
    params,
    showLoading
  })
}
// 角色添加
export function groupsCreate(data, showLoading) {
  return request({
    url: `/admin/groups/create`,
    data,
    method: 'post',
    showLoading
  })
}
// 角色修改
export function groupsUpdate(data, showLoading) {
  return request({
    url: `/admin/groups/update`,
    data,
    method: 'post',
    showLoading
  })
}
// 角色禁用
export function groupsEnables(data, showLoading) {
  return request({
    url: `/admin/groups/enables`,
    data,
    method: 'post',
    showLoading
  })
}
// 菜单列表
export function menus(showLoading) {
  return request({
    url: `/admin/menus`,
    method: 'get',
    showLoading
  })
}
// 添加菜单
export function menusSave(data, showLoading) {
  return request({
    url: `/admin/menus/save`,
    method: 'post',
    data,
    showLoading
  })
}
// 修改菜单
export function menusUpdate(data, showLoading) {
  return request({
    url: `/admin/menus/update`,
    method: 'post',
    data,
    showLoading
  })
}
// 删除菜单
export function menusDelete(data, showLoading) {
  return request({
    url: `/admin/menus/delete`,
    method: 'post',
    data,
    showLoading
  })
}

// 禁用菜单
export function menusEnables(data, showLoading) {
  return request({
    url: `/admin/menus/enables`,
    method: 'post',
    data,
    showLoading
  })
}
// 岗位列表
export function posts(showLoading) {
  return request({
    url: `/admin/posts`,
    method: 'get',
    showLoading
  })
}
// 部门列表
export function structures(showLoading) {
  return request({
    url: `/admin/structures`,
    method: 'get',
    showLoading
  })
}// 菜单列表
export function menu_list(showLoading) {
  return request({
    url: `admin/users/menu_list`,
    method: 'get',
    showLoading
  })
}

