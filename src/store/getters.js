const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  authKey: state => state.user.authKey,
  sessionId: state => state.user.sessionId,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes,
  errorLogs: state => state.errorLog.logs,
  stat_list: state => state.tempData.stat_list,
  hash_list: state => state.tempData.hash_list,
  timer: state => state.tempData.timer,
  market_code: state => state.tempData.market_code,
  market_status: state => state.tempData.market_status,
  company_status: state => state.tempData.company_status

}
export default getters
