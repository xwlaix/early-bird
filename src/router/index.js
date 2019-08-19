import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
// import componentsRouter from './modules/components'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '运营总览', icon: 'dashboard', affix: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/group',
    component: Layout,
    redirect: '/group/show',
    name: 'Group',
    meta: { title: '买家管理', icon: 'suppliers', roles: [
      'group:step',
      'group:detail:show'
    ] },
    alwaysShow: true,
    children: [
      {
        path: 'show',
        name: 'GroupManage',
        component: () => import('@/views/newGroup/show'),
        meta: { title: '档案管理', roles: ['group:detail:show'] }
      }
    ]
  },
  {
    path: '/supplier',
    component: Layout,
    redirect: '/supplier/show',
    name: 'supplier',
    meta: { title: '供应商管理', icon: 'idCard' },
    alwaysShow: true,
    children: [
      {
        path: 'show',
        name: 'SupplierManage',
        component: () => import('@/views/supplier/show'),
        meta: { title: '供应商监控' }
      }
    ]
  },
  {
    path: '/market',
    component: Layout,
    redirect: '/market/newMarketToday',
    name: 'MarketManage',
    meta: { title: '市场管理', icon: 'bag', roles: [
      'market:user:show',
      'market:list:show',
      'market:today:show',
      'market:money:show'
    ] },
    children: [
      {
        path: 'newMarketToday',
        component: () => import('@/views/newMarketToday/show'),
        name: 'NewMarketToday',
        meta: { title: '今日市场', roles: ['market:clearing:day:show', 'market:clearing:pay:show'] }
      },
      {
        path: 'customerMarket',
        component: () => import('@/views/customerMarket/show'),
        name: 'CustomerMarket',
        meta: { title: '客户市场', roles: ['market:clearing:day:show', 'market:clearing:pay:show'] }
      },
      {
        path: 'payMonitor',
        component: () => import('@/views/marketClearing/payMonitor'),
        name: 'payMonitor',
        meta: { title: '付款监控', roles: ['market:clearing:day:show', 'market:clearing:pay:show'] }
      }
    ]
  },
  {
    path: '/setting',
    component: Layout,
    redirect: '/setting/user',
    name: 'SettingManage',
    meta: { title: '系统管理', icon: 'cogs', roles: ['setting:user:show', 'setting:role:show', 'setting:menu:show', 'setting:calendar:show'] },
    children: [
      {
        path: 'user',
        name: 'SettingJurisdiction',
        component: () => import('@/views/setting/jurisdiction'),
        meta: { title: '用户管理', roles: ['setting:user:show'] }
      },
      {
        path: 'role',
        component: () => import('@/views/setting/role'),
        name: 'SettingRole',
        meta: { title: '角色管理', roles: ['setting:role:show'] }
      },
      {
        path: 'calendar',
        component: () => import('@/views/setting/calendar'),
        name: 'SettingCalendar',
        meta: { title: '开市日历', roles: ['setting:calendar:show'] }
      },
      {
        path: 'template',
        name: 'EmailTemplate',
        component: () => import('@/views/email/template'),
        meta: { title: '邮件模板', roles: ['email:template:show'] }
      },
      {
        path: 'commission',
        name: 'Commission',
        component: () => import('@/views/commission/index'),
        meta: { title: '费率设置', roles: ['email:template:show'] }
      }
    ]
  },
  {
    path: '/repairs',
    component: Layout,
    redirect: '/repairs/problem',
    name: 'repairsManage',
    meta: { title: '运维监控', icon: 'repairs' },
    children: [
      {
        path: 'problem',
        component: () => import('@/views/repairs/problem'),
        name: 'Problem',
        meta: { title: '反馈问题', roles: ['setting:problem:show'] }
      },
      {
        path: 'emailLog',
        component: () => import('@/views/repairs/emailLog'),
        name: 'EmailLog',
        meta: { title: '邮件日志', roles: ['email:log:show'] }
      },
      {
        path: 'ApiLog',
        component: () => import('@/views/repairs/apiLog'),
        name: 'ApiLog',
        meta: { title: '接口日志', roles: ['setting:apiLog:show'] }
      },
      {
        path: 'menu',
        component: () => import('@/views/repairs/menu'),
        name: 'SettingMenu',
        meta: { title: '菜单管理', roles: ['setting:menu:show'] }
      }
    ]
  },
  {
    path: '/finance',
    component: Layout,
    redirect: '/finance/index',
    name: 'finance',
    meta: { title: '财务管理', icon: 'RMB' },
    alwaysShow: true,
    children: [
      {
        path: 'index',
        name: 'CommissionDetail',
        component: () => import('@/views/finance/index'),
        meta: { title: '服务收费' }
      },
      {
        path: 'template',
        name: 'PdfTemplate',
        component: () => import('@/views/finance/pdfTemplate'),
        meta: { title: '服务收费模板' }
      }
    ]
  },
  {
    path: '/statement',
    component: Layout,
    redirect: '/statement/industry',
    name: 'statement',
    meta: { title: '报表管理', icon: 'line-chart' },
    alwaysShow: true,
    children: [
      {
        path: 'industry',
        name: 'Industry',
        component: () => import('@/views/statement/industry'),
        meta: { title: '行业分析' }
      },
      {
        path: 'area',
        name: 'Area',
        component: () => import('@/views/statement/area'),
        meta: { title: '地域分析' }
      },
      {
        path: 'funnel',
        name: 'Funnel',
        component: () => import('@/views/statement/funnel'),
        meta: { title: '漏斗分析' }
      },
      {
        path: 'lifecycle',
        name: 'Lifecycle',
        component: () => import('@/views/statement/lifecycle'),
        meta: { title: '生命周期' }
      },
      {
        path: 'rate',
        name: 'Rate',
        component: () => import('@/views/statement/rate'),
        meta: { title: '年化率分析' }
      },
      {
        path: 'repeat',
        name: 'Repeat',
        component: () => import('@/views/statement/repeat'),
        meta: { title: '复参分析' }
      }
    ]
  },
  {
    path: '/pdf',
    component: Layout,
    redirect: '/pdf/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/pdf/index'),
        name: 'PDF',
        meta: { title: 'pdf', icon: 'pdf' }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
