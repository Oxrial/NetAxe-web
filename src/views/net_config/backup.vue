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
      <DataForm
        ref="searchForm"
        :form-config="{
          labelWidth: 80,
          size: 'medium'
        }"
        preset="search"
        :options="conditionItems"
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
    <ModalDialog
      ref="backupModalDialogRef"
      :title="itemDataForm.modalDialogConfig.title + '备份任务'"
      @confirm="itemDataForm.submitConfirm"
      :style="{ height: '82vh', width: '76%', 'margin-top': '5vh' }"
      :on-after-leave="itemDataForm.modalDialogConfig.close"
    >
      <template #content>
        <DataForm
          ref="itemDataFormRef"
          :options="itemDataForm.itemFormOptions"
          preset="dialog"
          :form-config="{
            labelWidth: 80,
            labelAlign: 'left'
          }"
        />
        <n-data-table
          :data="itemDataForm.checkedDataList()"
          :columns="selectEquip.tableColumns"
          :pagination="{
            prefix: tablePrefix,
            pageSize: 10,
            showSizePicker: true,
            pageSizes: [10, 30, 50]
          }"
          size="small"
          style="height: calc(100% - 12rem); width: 80%; margin: 0 auto"
          :row-key="selectEquip.rowKey"
          v-model:checked-row-keys="itemDataForm.checkedSelectEquipRowKeys.value"
          @update:checked-row-keys="itemDataForm.updateCheckedSelectEquipRowKeys"
          flex-height
        />
      </template>
    </ModalDialog>
    <ModalDialog
      ref="selectEquipModalDialogRef"
      title="选择设备"
      contentHeight="100%"
      @confirm="selectEquip.submitConfirm"
      :style="{ height: '80vh', width: '75%', 'margin-top': '6vh' }"
      :on-after-leave="selectEquip.modalDialogConfig.close"
    >
      <template #content>
        <n-grid x-gap="20" cols="4" style="height: 100%">
          <n-grid-item>
            <n-tree
              block-line
              block-node
              selectable
              :data="selectEquip.treeConfig.data"
              :default-expanded-keys="selectEquip.treeConfig.defaultExpandedKeys"
              :node-props="selectEquip.treeConfig.nodeProps"
            />
          </n-grid-item>
          <n-grid-item span="3">
            <n-card style="height: 100%">
              <DataForm
                ref="equipSearchFormRef"
                :form-config="{
                  labelWidth: 80,
                  size: 'small',
                  style: {
                    display: 'flex'
                  }
                }"
                preset="search"
                :options="selectEquip.equipSearchOptions"
              />
              <n-data-table
                :loading="selectEquip.tableLoading.value"
                :data="
                  equipSearchFormRef?.generatorParams()?.column && equipSearchFormRef?.generatorParams()?.filterValue
                    ? selectEquip.dataList.filter(
                        (d) => d[equipSearchFormRef?.generatorParams()?.column]?.indexOf(equipSearchFormRef?.generatorParams()?.filterValue) > 0
                      )
                    : selectEquip.dataList
                "
                :columns="selectEquip.tableColumns"
                :pagination="{
                  prefix: tablePrefix,
                  pageSize: 10,
                  showSizePicker: true,
                  pageSizes: [10, 30, 50]
                }"
                size="small"
                style="height: calc(50% - 2.1875rem); margin-bottom: 1.25rem"
                :row-key="selectEquip.rowKey"
                flex-height
                v-model:checked-row-keys="selectEquip.checkedRowKeys.value"
                @update:checked-row-keys="selectEquip.updateCheckedRowKeys"
              />
              <n-data-table
                :data="selectEquip.dataList.filter((d) => selectEquip.checkedRowKeys.value.includes(d.name))"
                :columns="selectEquip.tableColumns"
                :pagination="{
                  prefix: () => selectEquip.checkedPaginationPrefix(),
                  pageSize: 10,
                  showSizePicker: true,
                  pageSizes: [10, 30, 50]
                }"
                size="small"
                style="height: calc(50% - 2.1875rem)"
                :row-key="selectEquip.rowKey"
                v-model:checked-row-keys="selectEquip.checkedRowKeys.value"
                @update:checked-row-keys="selectEquip.updateCheckedRowKeys"
                flex-height
              />
            </n-card>
          </n-grid-item>
        </n-grid>
      </template>
    </ModalDialog>
  </div>
</template>

<script setup lang="ts" name="Backup">
import { useGet } from '@/hooks/useApi'
import { get_net_config_backupList } from '@/api/url'

import { DataFormType, ModalDialogType, FormItem, Operation } from '@/types/components'
import { DataTableColumn, NInput, NSelect, SelectOption, useMessage, NButton, NIcon, NSpace, DataTableRowKey } from 'naive-ui'
import { useTable } from '@/hooks/table'
import { tablePrefix } from '@/utils'
import { RestartAltTwotone, AddCircleOutlineRound, NotStartedOutlined, StopCircleOutlined } from '@vicons/material'

const searchForm = ref<DataFormType | null>(null)

const conditionItems: Array<FormItem | Operation> = [
  {
    key: 'name',
    label: '任务名称',
    value: ref(null),
    render: (formItem) => {
      return h(NInput, {
        value: formItem.value.value,
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
  },

  {
    key: 'state',
    label: '状态',
    value: ref(null),
    optionItems: [
      { value: '1', label: '开启' },
      { value: '0', label: '关闭' }
    ],
    render: (formItem) => {
      return h(NSelect, {
        options: formItem.optionItems as Array<SelectOption>,
        value: formItem.value.value,
        clearable: true,
        onUpdateValue: (val) => {
          formItem.value.value = val
          onSearch()
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
              onResetSearch()
              onSearch()
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
              backupModalDialogRef.value?.toggle()
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
]
let request_url = ''

const onResetSearch = () => {
  searchForm.value?.reset()
}
const onSearch = () => {
  const search_form = searchForm.value?.generatorParams()
  request_url = get_net_config_backupList + '?name=' + search_form.name + '&state=' + search_form.state
  doRefresh()
}

const get = useGet()
const message = useMessage()

const table = useTable()
const { tableLoading, dataList } = table

const doRefresh = () => {
  get({
    url: request_url,
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

import useItemDataForm from './hooks/backup/useItemDataForm'
const backupModalDialogRef = ref<ModalDialogType | null>(null)
const itemDataFormRef = ref<DataFormType | null>(null)
const selectEquipModalDialogRef = ref<ModalDialogType | null>(null)
const equipSearchFormRef = ref<DataFormType | null>(null)
const itemDataForm = useItemDataForm({ doRefresh, backupModalDialogRef, itemDataFormRef, selectEquipModalDialogRef, equipSearchFormRef })
const { selectEquip } = itemDataForm
onMounted(() => {
  onSearch()
})
</script>
