import { NInput, DataTableColumn, useMessage, NIcon, NTag, TreeOption, NSelect, SelectOption } from 'naive-ui'
import { GlobeOutline, BusinessOutline, FileTrayStackedOutline } from '@vicons/ionicons5'
import { FormItem } from '@/types/components'
import type { DataTableRowKey } from 'naive-ui'
import { useTable, useTableColumn } from '@/hooks/table'
import { useGet } from '@/hooks/useApi'
import { get_net_equipList } from '@/api/url'
import { arrClear } from '@/utils'

export default function ({ dataFormRef, selectEquipModalDialogRef }: any) {
  const modalDialogConfig = {
    close: () => arrClear(checkedRowKeys.value)
  }
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
  const submitConfirm = () => {
    const selectEquipFormItem = dataFormRef?.value.options.find((iform: FormItem) => iform.key === 'selectEquip')
    // console.log(selectEquipModalDialogRef)
    selectEquipFormItem!.value!.value = [...checkedRowKeys.value]
    selectEquipModalDialogRef?.value?.toggle()
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
      key: 'column',
      label: '',
      value: ref(null),
      style: {
        minWidth: 'unset'
      },
      optionItems: [
        {
          label: '名称',
          value: 'name'
        },
        {
          label: 'IP地址',
          value: 'ip'
        }
      ],
      render: (formItem) => {
        return h(NSelect, {
          style: { width: '7.5rem' },
          value: formItem.value.value,
          clearable: true,
          options: formItem.optionItems as Array<SelectOption>,
          placeholder: '过滤条件',
          onUpdateValue: (val) => {
            formItem.value.value = val
          }
        })
      }
    },
    {
      key: 'filterValue',
      label: '',
      value: ref(''),
      render: (formItem) => {
        return h(NInput, {
          value: formItem.value.value,
          clearable: true,
          onUpdateValue: (val) => {
            formItem.value.value = val
          },
          onKeyup: (Event) => {
            if (Event.key == 'Enter') {
              onSearch()
            }
          }
        })
      }
    }
  ]
  const onResetSearch = () => {}
  const doMounted = () => {
    leafEOC(treeConfig.data)
    onSearch()
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
  const onSearch = () => {
    doRefresh()
  }

  type RowData = {
    state: string
    name: string
    ip: string
    type: string
    ftpType: string
    subNetName: string
    description: string
  }
  const table = useTable()
  const tableColumns = useTableColumn(
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
    ] as DataTableColumn[],
    {
      align: 'center'
    } as DataTableColumn
  )
  const rowKey = (row: RowData) => row.name
  const checkedRowKeys = ref<any[]>([])
  const updateCheckedRowKeys = (rowKeys: DataTableRowKey[]) => {
    checkedRowKeys.value = rowKeys
  }
  const checkedPaginationPrefix = () =>
    h('span', { style: { 'text-align': 'left' } }, `已选择 ${table.dataList.filter((d) => checkedRowKeys.value.includes(d.name)).length} 条`)
  return {
    modalDialogConfig,
    submitConfirm,
    equipSearchOptions,
    onSearch,
    onResetSearch,
    treeConfig,
    rowKey,
    ...table,
    tableColumns,
    checkedPaginationPrefix,
    checkedRowKeys,
    updateCheckedRowKeys,
    doMounted
  }
}
