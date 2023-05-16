import { MockMethod } from 'vite-plugin-mock'
import Mock from 'mockjs'

const data = Mock.mock({
  'backuplist|100': [
    {
      'id|+1': 1,
      name: 'task_@integer(1,3)',
      'state|1': ['0', '1'],
      time: '@integer(1,50)',
      backuptime: '@datetime',
      'backresult|1': [0, 1]
    }
  ],
  'equipList|100': [
    {
      name: '设备_@increment',
      code: 'EQUIP@increment',
      'state|1': ['0', '1'],
      ip: '@IP',
      'type|1': ['1', '2', '3'],
      'ftpType|1': ['1', '2', '3'],
      'center|1': ['1', '2', '3'],
      version: 'v@integer(1,5).@integer(0,3).@integer(0,4)',
      subNetName: '@string(3, 6)',
      description: '@cparagraph(1,1,5)'
    }
  ],
  'filesList|100': [
    {
      name: 'EQUIP_@increment',
      ip: '@IP',
      'center|1': ['1', '2', '3'],
      code: 'EQUIP@increment',
      'type|1': ['1', '2', '3'],
      backuptime: '@datetime'
    }
  ],
  'confFilesList|100': [
    {
      fileName: 'file_@increment',
      backuptime: '@datetime'
    }
  ]
})
export default [
  {
    url: '/api/net_config/backuplist/',
    method: 'get',
    response: () => {
      return {
        code: 200,
        msg: '获取成功',
        results: data.backuplist
      }
    }
  },
  {
    url: '/api/net_config/backupupdate/',
    method: 'post',
    response: () => {
      return {
        code: 200,
        msg: '更新成功',
        results: null
      }
    }
  },
  {
    url: '/api/net_config/equipList/',
    method: 'get',
    response: () => {
      return {
        code: 200,
        msg: '获取成功',
        results: data.equipList
      }
    }
  },
  {
    url: '/api/net_config/filesList/',
    method: 'get',
    response: () => {
      return {
        code: 200,
        msg: '获取成功',
        results: data.filesList
      }
    }
  },
  {
    url: '/api/net_config/confFilesList/',
    method: 'get',
    response: () => {
      return {
        code: 200,
        msg: '获取成功',
        results: data.confFilesList
      }
    }
  },
  {
    url: '/rbac/system/menu/web_router/',
    method: 'get',
    response: () => {
      return {
        code: 200,
        msg: '获取成功',
        results: [
          {
            id: 20014,
            parent: null,
            icon: '',
            sort: 1,
            name: '资源管理',
            is_link: false,
            is_catalog: false,
            web_path: '/cmdb',
            component: null,
            component_name: null,
            cache: false,
            visible: true,
            menuPermission: [],
            children: [
              {
                id: 20015,
                parent: 20014,
                icon: '',
                sort: 1,
                name: '网络设备',
                is_link: false,
                is_catalog: false,
                web_path: '/cmdb/network_device',
                component: null,
                component_name: null,
                cache: false,
                visible: true,
                menuPermission: [],
                children: null
              }
            ]
          },
          {
            id: 1008,
            parent: null,
            icon: null,
            sort: 2,
            name: '自动化',
            is_link: false,
            is_catalog: false,
            web_path: '/automated',
            component: null,
            component_name: null,
            cache: false,
            visible: true,
            menuPermission: [],
            children: [
              {
                id: 10089,
                parent: 1008,
                icon: null,
                sort: 1,
                name: '采集方案',
                is_link: false,
                is_catalog: false,
                web_path: '/automated/collect',
                component: null,
                component_name: null,
                cache: false,
                visible: true,
                menuPermission: [],
                children: null
              }
            ]
          },
          {
            id: 10012,
            parent: null,
            icon: null,
            sort: 3,
            name: '配置中心',
            is_link: false,
            is_catalog: false,
            web_path: '/config_manage',
            component: null,
            component_name: null,
            cache: false,
            visible: true,
            menuPermission: [],
            children: [
              {
                id: 10025,
                parent: 10012,
                icon: null,
                sort: 1,
                name: 'FSM模板',
                is_link: false,
                is_catalog: false,
                web_path: '/config_manage/fsm_template',
                component: null,
                component_name: null,
                cache: false,
                visible: true,
                menuPermission: [],
                children: null
              },
              {
                id: 10026,
                parent: 10012,
                icon: null,
                sort: 1,
                name: 'TTP模板',
                is_link: false,
                is_catalog: false,
                web_path: '/config_manage/ttp_template',
                component: null,
                component_name: null,
                cache: false,
                visible: true,
                menuPermission: [],
                children: null
              },
              {
                id: 10027,
                parent: 10012,
                icon: null,
                sort: 1,
                name: '配置合规',
                is_link: false,
                is_catalog: false,
                web_path: '/config_manage/compliance',
                component: null,
                component_name: null,
                cache: false,
                visible: true,
                menuPermission: [],
                children: null
              },
              {
                id: 10029,
                parent: 10012,
                icon: null,
                sort: 1,
                name: '配置差异',
                is_link: false,
                is_catalog: false,
                web_path: '/config_manage/gitdiff',
                component: null,
                component_name: null,
                cache: false,
                visible: true,
                menuPermission: [],
                children: null
              }
            ]
          },
          {
            id: 10020,
            parent: null,
            icon: null,
            sort: 4,
            name: '作业中心',
            is_link: false,
            is_catalog: false,
            web_path: '/task_center',
            component: null,
            component_name: null,
            cache: false,
            visible: true,
            menuPermission: [],
            children: [
              {
                id: 10022,
                parent: 10020,
                icon: null,
                sort: 1,
                name: '调度管理',
                is_link: false,
                is_catalog: false,
                web_path: '/task_center/dispatch_manage',
                component: null,
                component_name: null,
                cache: false,
                visible: true,
                menuPermission: [],
                children: null
              },
              {
                id: 10021,
                parent: 10020,
                icon: null,
                sort: 2,
                name: '任务列表',
                is_link: false,
                is_catalog: false,
                web_path: '/task_center/task_list',
                component: null,
                component_name: null,
                cache: false,
                visible: true,
                menuPermission: [],
                children: null
              }
            ]
          },
          {
            id: 20001,
            parent: null,
            icon: null,
            sort: 5,
            name: '地址管理',
            is_link: false,
            is_catalog: false,
            web_path: '/ip_manage',
            component: null,
            component_name: null,
            cache: false,
            visible: true,
            menuPermission: [],
            children: [
              {
                id: 20002,
                parent: 20001,
                icon: null,
                sort: 1,
                name: 'IPAM',
                is_link: false,
                is_catalog: false,
                web_path: '/ip_manage/ipam',
                component: null,
                component_name: null,
                cache: false,
                visible: true,
                menuPermission: [],
                children: null
              }
            ]
          },
          {
            id: 20006,
            parent: null,
            icon: null,
            sort: 6,
            name: '拓扑管理',
            is_link: false,
            is_catalog: false,
            web_path: '/net_topology',
            component: null,
            component_name: null,
            cache: false,
            visible: true,
            menuPermission: [],
            children: [
              {
                id: 20011,
                parent: 20006,
                icon: 'Youtube-fill',
                sort: 1,
                name: '拓扑展示',
                is_link: false,
                is_catalog: false,
                web_path: '/net_topology/show',
                component: null,
                component_name: null,
                cache: false,
                visible: true,
                menuPermission: [],
                children: null
              },
              {
                id: 20012,
                parent: 20006,
                icon: null,
                sort: 2,
                name: '图标库',
                is_link: false,
                is_catalog: false,
                web_path: '/net_topology/topology_icon',
                component: null,
                component_name: null,
                cache: false,
                visible: true,
                menuPermission: [],
                children: null
              }
            ]
          },
          {
            id: 20007,
            parent: null,
            icon: null,
            sort: 7,
            name: '网络配置备份',
            is_link: false,
            is_catalog: false,
            web_path: '/net_config',
            component: null,
            component_name: null,
            cache: false,
            visible: true,
            menuPermission: [],
            children: [
              {
                id: 20071,
                parent: 20007,
                icon: 'Youtube-fill',
                sort: 1,
                name: '备份任务',
                is_link: false,
                is_catalog: false,
                web_path: '/net_config/backup',
                component: null,
                component_name: null,
                cache: false,
                visible: true,
                menuPermission: [],
                children: null
              },
              {
                id: 20072,
                parent: 20007,
                icon: null,
                sort: 2,
                name: '配置文件',
                is_link: false,
                is_catalog: false,
                web_path: '/net_config/files',
                component: null,
                component_name: null,
                cache: false,
                visible: true,
                menuPermission: [],
                children: null
              }
            ]
          },
          {
            id: 20008,
            parent: null,
            icon: null,
            sort: 8,
            name: '网络设备管理',
            is_link: false,
            is_catalog: false,
            web_path: '/net_equip',
            component: null,
            component_name: null,
            cache: false,
            visible: true,
            menuPermission: [],
            children: [
              {
                id: 20081,
                parent: 20008,
                icon: 'Youtube-fill',
                sort: 1,
                name: '网络设备管理',
                is_link: false,
                is_catalog: false,
                web_path: '/net_equip/index',
                component: null,
                component_name: null,
                cache: false,
                visible: true,
                menuPermission: [],
                children: null
              }
            ]
          }
        ],
        count: 8,
        page: 1,
        limit: 1
      }
    }
  },
  {
    url: '/api/login',
    method: 'post',
    response: () => {
      return {
        code: 200,
        msg: '请求成功',
        data: {
          refresh:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4MjQ5NDQ1MSwiaWF0IjoxNjgyNDA4MDUxLCJqdGkiOiJlODM2NjVlNDA3Y2Y0YzE3YTI5YTA3YmRmMGFlOTg4YyIsInVzZXJfaWQiOjJ9.JDE2mT-H_AOYOb4LU2K_Enf_ljyXQ48Z6VfazEGl-Gw',
          access:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjgyNDExNjUxLCJpYXQiOjE2ODI0MDgwNTEsImp0aSI6IjRkZWIwMDgwM2I3NjQ5ZGI4YWRkNDBiNWNiNjc4N2UyIiwidXNlcl9pZCI6Mn0.qzgbvUvD6-hJJgFC3VYiDwRdBWvooip_HOeKh_q3fOo',
          username: 'adminnetaxe',
          token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjgyNDExNjUxLCJpYXQiOjE2ODI0MDgwNTEsImp0aSI6IjU1Y2U4NzBjMTRlZDQ3Nzk5MzVkOWQyMzNiOWFlMWEwIiwidXNlcl9pZCI6Mn0.GKMiC6ZTSFh6DYYNhBjwptF9NfkRmGMjGa9C6RsnQz4',
          isSuperuser: true
        }
      }
    }
  }
] as MockMethod[]
