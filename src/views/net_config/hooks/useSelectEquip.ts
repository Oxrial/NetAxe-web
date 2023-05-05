import { NInput, DataTableColumn, useMessage, NIcon, NTag, TreeOption } from 'naive-ui'
import { GlobeOutline, BusinessOutline, FileTrayStackedOutline } from '@vicons/ionicons5'
import { ModalDialogType, FormItem } from '@/types/components'
import type { DataTableRowKey } from 'naive-ui'
import { useTable, useTableColumn } from '@/hooks/table'
import { useGet } from '@/hooks/useApi'
import { get_net_equipList } from '@/api/url'

export default function () {
  let parentObject: any = {}
  const useTriggerParent = (object: any) => (parentObject = object)

  const modalDialogRef = ref<ModalDialogType | null>(null)
  interface TreeConfig {
    data: TreeOption[]
    defaultExpandedKeys: Array<string>
    nodeProps: any
  }
  const treeConfig = reactive<TreeConfig>({
    data: [
      {
        label: '网络设备',
        key: 'checkAll',
        children: [
          {
            label: '滨湖机房',
            key: 'binhu',
            children: [
              {
                label: '交换机',
                key: 'switchboard'
              }
            ]
          }
        ]
      }
    ],
    defaultExpandedKeys: [],
    nodeProps: ({ option }: { option: TreeOption }) => {
      return {
        onClick() {
          message.info('[Click] ' + option.key)
        }
      }
    }
  })
  function leafEOC(leafs: TreeOption[], depth = 1) {
    leafs.forEach((leaf: TreeOption) => {
      leaf.prefix = () =>
        h(NIcon, null, {
          default: () => h(leafIcons[depth] || BusinessOutline)
        })
      if (leaf.children && leaf.children.length) {
        leafEOC(leaf.children, depth + 1)
      }
    })
  }
  const doMounted = () => {
    leafEOC(treeConfig.data)
    onSearch()
  }
  const submitChecked: any[] = []
  const submitConfirm = () => {
    submitChecked.splice(0, submitChecked.length)
    submitChecked.push(...checkedRowKeys.value)
    // modalDialogRef.value?.toggle()
    parentObject.useSelectEquipModalDialogRef()?.value?.toggle()
    // console.log('submitConfirm', modalDialogRef)
  }
  interface LeafIconEnums {
    [key: string]: any
  }
  const leafIcons: LeafIconEnums = {
    1: GlobeOutline,
    2: FileTrayStackedOutline
  }

  const equipSearchOptions: Array<FormItem> = [
    {
      key: 'value',
      label: '',
      value: ref(''),
      render: (formItem) => {
        return h(NInput, {
          value: formItem.value.value,
          placeholder: 'IP',
          onUpdateValue: (val) => {
            formItem.value.value = val
          },
          onKeyup: (Event) => {
            if (Event.key == 'Enter') {
              // parentObject.onSearch()
            }
          }
        })
      }
    }
  ]
  const onResetSearch = () => {}
  const onSearch = () => {
    doRefresh()
  }
  const get = useGet()
  const message = useMessage()
  const doRefresh = () => {
    get({
      url: get_net_equipList,
      data: () => {
        return {
          _: Date.now()
        }
      }
    }).then((res) => {
      message.success(res.msg)
      table.handleSuccess(res)
    })
  }

  const table = useTable()
  const tableColumns = reactive(
    useTableColumn(
      [
        {
          type: 'selection'
        },
        {
          title: '状态',
          width: 60,
          key: 'state',
          render: (row) => {
            if (row.state === '1') {
              return h(NTag, { type: 'success' }, () => h('span', {}, '在线'))
            } else if (row.state === '0') {
              return h(NTag, { type: 'error' }, () => h('span', {}, '离线'))
            } else {
              return h(NTag, () => h('span', {}, '未知'))
            }
          }
        },
        {
          title: '名称',
          key: 'name'
        },
        {
          title: 'IP地址',
          key: 'ip',
          ellipsis: true,
          width: 135
        },
        {
          title: '类型',
          key: 'type',
          width: 80
        },
        {
          title: 'FTP类型',
          key: 'ftpType',
          width: 80
        },
        {
          title: '子网名称',
          key: 'subNetName'
        },
        {
          title: '描述',
          key: 'description'
        }
      ],
      {
        align: 'center'
      } as DataTableColumn
    )
  )
  type RowData = {
    state: string
    name: string
    ip: string
    type: string
    ftpType: string
    subNetName: string
    description: string
  }
  const rowKey = (row: RowData) => row.name
  const checkedRowKeys = ref<any[]>([])
  const updateCheckedRowKeys = (rowKeys: DataTableRowKey[]) => {
    checkedRowKeys.value = rowKeys
  }
  const tablePaginationPrefix = () => h('span', {}, `共 ${table.dataList.length} 条`)
  const checkedPaginationPrefix = () =>
    h('span', { style: { 'text-align': 'left' } }, `已选择 ${table.dataList.filter((d) => checkedRowKeys.value.includes(d.name)).length} 条`)
  return {
    modalDialogRef,
    submitConfirm,
    useTriggerParent,
    equipSearchOptions,
    onSearch,
    onResetSearch,
    treeConfig,
    rowKey,
    ...table,
    tableColumns,
    tablePaginationPrefix,
    checkedPaginationPrefix,
    checkedRowKeys,
    updateCheckedRowKeys,
    doMounted,
    submitChecked
  }
}
