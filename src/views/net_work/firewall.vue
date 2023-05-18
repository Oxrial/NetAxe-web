<style scoped lang="scss">
.n-data-table {
  :deep(.n-data-table__pagination) {
    justify-content: flex-start;
  }
}
</style>

<template>
  <div class="main-container">
    <n-card>
      <OriginForm
        ref="searchFormRef"
        :form-config="{
          labelWidth: 80,
          size: 'medium'
        }"
        preset="search"
        :options="formOptions"
        @submit="onSearch"
      />
      <n-data-table
        :loading="tableLoading"
        :data="dataList"
        :columns="tableColumns"
        :pagination="tablePagination"
        style="height: calc(100vh - 16rem)"
        :row-key="rowKey"
        v-model:checked-row-keys="checkedRowKeys"
        @update:checked-row-keys="updateCheckedRowKeys"
        flex-height
      />
    </n-card>
  </div>
</template>

<script setup lang="ts" name="Backup">
import { useGet } from '@/hooks/useApi'
import { get_net_config_backupList } from '@/api/url'

import {
  CommFormType,
  // , ModalDialogType, CommItem
  FormItem
  // , Operation
} from '@/types/components'
import { NInput, DataTableColumn, SelectOption, useMessage, NButton, NIcon, NSpace, DataTableRowKey, NSelect } from 'naive-ui'
// import { useLoadCommon } from '@/utils/CommForm'
import { useTable } from '@/hooks/table'
import { tablePrefix } from '@/utils'
import { RestartAltTwotone, AddCircleOutlineRound, NotStartedOutlined, StopCircleOutlined } from '@vicons/material'

const searchFormRef = ref<CommFormType | null>(null)
const formOptions = [
  {
    key: 'name',
    label: '任务名称',
    value: ref(null),
    render: (formItem: FormItem) => {
      return h(NInput, {
        value: formItem.value.value,
        onUpdateValue: (val) => {
          formItem.value.value = val
        },
        onKeyup: (Event) => {
          if (Event.key == 'Enter') {
            // onSearch()
          }
        }
      })
    }
  },

  {
    key: 'state',
    label: '状态',
    optionItems: [
      { value: '1', label: '开启' },
      { value: '0', label: '关闭' }
    ],
    value: ref(null),
    render: (formItem: FormItem) => {
      return h(NSelect, {
        options: formItem.optionItems as Array<SelectOption>,
        clearable: true,
        value: formItem.value.value,
        onUpdateValue: (val) => {
          formItem.value.value = val
        }
      })
    }
  },
  {
    render: () =>
      h(NSpace, {}, () => [
        h(
          NButton,
          {
            type: 'success',
            size: 'small',
            onClick: () => {
              searchFormRef.value?.reset()
              // state.data = cloneDeep(dataOrigin)
              // onSearch()
            }
          },
          { icon: () => h(NIcon, {}, () => h(RestartAltTwotone)), default: () => h('span', '重置') }
        ),
        h(
          NButton,
          {
            type: 'info',
            size: 'small',
            onClick: () => {
              // backupModalDialogRef.value?.toggle()
            }
          },
          { icon: () => h(NIcon, {}, () => h(AddCircleOutlineRound)), default: () => h('span', '新建') }
        ),
        h(
          NButton,
          {
            type: 'info',
            size: 'small',
            disabled: !checkedRowKeys.value.length,
            onClick: () => {
              console.log('start', checkedRowKeys.value)
            }
          },
          { icon: () => h(NIcon, {}, () => h(NotStartedOutlined)), default: () => h('span', '启用') }
        ),
        h(
          NButton,
          {
            type: 'error',
            size: 'small',
            disabled: !checkedRowKeys.value.length,
            onClick: () => {
              console.log('stop', checkedRowKeys.value)
            }
          },
          { icon: () => h(NIcon, {}, () => h(StopCircleOutlined)), default: () => h('span', '禁用') }
        )
      ])
  }
] as Array<FormItem>

let submitSearchData: object | null = null
const onSearch = (obj: any) => {
  submitSearchData = obj
  doRefresh()
}

const get = useGet()
const message = useMessage()

const table = useTable()
const { tableLoading, dataList } = table
const doRefresh = () => {
  get({
    url: get_net_config_backupList,
    data: () => {
      return {
        ...submitSearchData,
        _: Date.now()
      }
    }
  }).then((res) => {
    message.success(res.msg)
    table.handleSuccess(res)
  })
}

const tablePagination = reactive({
  prefix: tablePrefix,
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [10, 30, 50],
  onChange: (page: number) => {
    tablePagination.page = page
  },
  onUpdatePageSize: (pageSize: number) => {
    tablePagination.pageSize = pageSize
    tablePagination.page = 1
  }
})
interface RowData {
  id: string | number
  name: string
  state: string
  time: string
  backuptime: string
  backresult: string
}
const rowKey = (row: RowData) => {
  return row.id
}
const tableColumns: DataTableColumn[] = [
  {
    type: 'selection'
  },
  {
    title: '任务名称',
    key: 'name'
  },
  {
    title: '状态',
    key: 'state',
    render: (row: RowData) => {
      if (row.state === '0') {
        return h(NButton, { type: 'error', size: 'tiny' }, () => h('span', {}, '关闭'))
      } else {
        return h(NButton, { type: 'primary', size: 'tiny' }, () => h('span', {}, '开启'))
      }
    }
  },
  {
    title: '执行周期',
    key: 'time'
    // render: (rowData) => {
    //   if (!rowData.expires) {
    //     return '永不过期'
    //   }
    // },
  },
  {
    title: '最新备份时间',
    key: 'backuptime'
  },
  {
    title: '最新备份结果',
    key: 'backresult',
    render: (row: RowData) => {
      if (row.backresult) {
        return h(NButton, { type: 'error', size: 'tiny' }, () => h('span', {}, '失败'))
      } else {
        return h(NButton, { type: 'primary', size: 'tiny' }, () => h('span', {}, '成功'))
      }
    }
  }
] as DataTableColumn[]

const checkedRowKeys = ref<any[]>([])
const updateCheckedRowKeys = (rowKeys: DataTableRowKey[]) => {
  checkedRowKeys.value = rowKeys
}

onMounted(() => searchFormRef.value?.submit())
</script>
