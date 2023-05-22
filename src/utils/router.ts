import Cookies from 'js-cookie'
import { get } from '@/api/http'
import layoutStore from '@/store'
import { Layout } from '@/components'
import { UserState } from '@/store/types'
import { defineAsyncComponent } from 'vue'
import { RouteRecordRaw } from 'vue-router'
import useUserStore from '@/store/modules/user'
import router, { constantRoutes } from '../router'
import { isExternal, mapTwoLevelRouter, toHump } from '.'
import LoadingComponent from '../components/loading/index.vue'
import { baseAddress, WebRouter, WebPermission } from '@/api/url'
import { ADMIN_WORK_USER_INFO_KEY, ADMIN_WORK_BUTTON_AUTH, ADMIN_WORK_S_TENANT } from '@/store/keys'
import { camelCase, cloneDeep, upperFirst } from 'lodash-es'

interface OriginRoute {
  key: any
  name: string
  web_path: string
  sort: number
  link_path?: string
  hidden?: boolean
  affix?: boolean
  cacheable?: boolean
  iconPrefix?: string
  icon?: string
  badge?: string | number
  children: Array<OriginRoute>
}

type RouteRecordRawWithHidden = RouteRecordRaw & { hidden: boolean }

function loadComponents() {
  return import.meta.glob('../views/**/*.vue')
}

const asynComponents = loadComponents()
const navigateID = localStorage.getItem(ADMIN_WORK_S_TENANT)

// 获取web权限
function getRoutes() {
  // console.log(layoutStore.state)
  return get({
    url: baseAddress + WebRouter,
    method: 'GET',
    data: { parent__isnull: true, navigate__id: navigateID }
  }).then((res: any) => {
    const routes = generatorRoutes(res.results)
    return cloneDeep(routes)
  })
}

// 获取menu权限x
function getPermission() {
  return get({
    url: baseAddress + WebPermission,
    method: 'GET',
    data: { navigate__id: navigateID }
  }).then((res: any) => {
    localStorage.setItem(ADMIN_WORK_BUTTON_AUTH, JSON.stringify(res.results))
  })
}
function getComponent(it: OriginRoute) {
  // 异步导入
  const component = defineAsyncComponent({
    loader: asynComponents['../views' + it.web_path + '.vue'],
    // loading组件
    loadingComponent: LoadingComponent
  })
  component.__warnedDefineAsync = true
  return component
}

function getCharCount(str: string, char: string) {
  const regex = new RegExp(char, 'g')
  // 带 / 的数量，递归children时，必为2个 / 以上
  const result = str.match(regex)
  const count = !result ? 0 : result.length
  return count
}

function isMenu(path: string) {
  return getCharCount(path, '/') === 1
}

function getNameByUrl(path: string) {
  const temp = path.split('/')
  return upperFirst(camelCase(toHump(temp[temp.length - 2]) + toHump(temp[temp.length - 1])))
}

function generatorRoutes(res: Array<OriginRoute>, prePath = '') {
  const tempRoutes: Array<RouteRecordRawWithHidden> = []
  res
    .sort((a, b) => a.sort - b.sort)
    .forEach((it) => {
      if (!it.key) {
        // 判断path是否为网址，否则为组件路由
        const truePath = prePath ? it.web_path.replace(new RegExp(prePath + '/'), '') : it.web_path
        const path = it.link_path && isExternal(it.link_path) ? it.link_path : truePath
        const route: RouteRecordRawWithHidden = {
          path: path,
          name: getNameByUrl(it.web_path),
          hidden: !!it.hidden,
          // 是否为根菜单，是为公共布局组件，否为局部组件
          component: it.web_path && isMenu(it.web_path) ? Layout : getComponent(it),
          meta: {
            title: it.name,
            affix: !!it.affix,
            cacheable: !!it.cacheable,
            icon: it.icon || 'menu',
            iconPrefix: it.iconPrefix || 'iconfont'
          }
        }
        if (it.children) {
          const childrenRoute = generatorRoutes(it.children, it.web_path)
          route.children = childrenRoute
        }
        tempRoutes.push(route)
      }
    })
  return tempRoutes
}

const whiteRoutes: string[] = ['/login', '/404', '/403', '/500']

function isTokenExpired(): boolean {
  const token = Cookies.get('netops-token')
  return !!token
}

router.beforeEach(async (to) => {
  if (whiteRoutes.includes(to.path)) {
    return true
  } else {
    // 检查cookies中的token
    if (!isTokenExpired()) {
      return {
        path: '/login',
        query: { redirect: to.fullPath }
      }
    } else {
      // 获取租户信息
      const userInfo: UserState = JSON.parse(localStorage.getItem(ADMIN_WORK_USER_INFO_KEY) || '{}')
      // 首次拦截检查状态中的路由，无则将已有的静态、动态路由加入到状态管理
      const isEmptyRoute = layoutStore.isEmptyPermissionRoute()
      if (isEmptyRoute && to.path != '/ssh') {
        // 加载路由和按钮
        const webRoutes = await getRoutes()
        // console.log(webRoutes)
        // const webPermission = await getPermission()
        const accessRoutes: Array<RouteRecordRaw> = []
        accessRoutes.push(...webRoutes)

        const mapRoutes = mapTwoLevelRouter(accessRoutes)
        mapRoutes.forEach((it: any) => {
          router.addRoute(it)
        })
        router.addRoute({
          path: '/:pathMatch(.*)*',
          redirect: '/404',
          hidden: true
        } as RouteRecordRaw)
        layoutStore.initPermissionRoute([...constantRoutes, ...accessRoutes])
        return { ...to, replace: true }
      } else {
        return true
      }
    }
  }
})
