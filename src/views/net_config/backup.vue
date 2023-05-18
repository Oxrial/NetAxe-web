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
      <CommForm
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
    <ModalDialog
      ref="modalDialogRef"
      :title="dataForm.modalDialogConfig.title + '备份任务'"
      @confirm="dataFormRef?.submit"
      :style="{ height: '82vh', width: '76%', 'margin-top': '5vh' }"
      :on-after-leave="dataForm.modalDialogConfig.close"
    >
      <template #content>
        <CommForm
          ref="dataFormRef"
          :options="dataForm.formOptions"
          preset="dialog"
          :form-config="{
            labelWidth: 80,
            labelAlign: 'left'
          }"
          @submit="dataForm.submitConfirm"
        />
        <n-data-table
          :data="dataForm.checkedDataList()"
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
          v-model:checked-row-keys="dataForm.checkedSelectEquipRowKeys.value"
          @update:checked-row-keys="dataForm.updateCheckedSelectEquipRowKeys"
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

import { CommFormType, ModalDialogType, FormItem, Operation, OriginItem } from '@/types/components'
import { NSelect, DataTableColumn, useMessage, NButton, NIcon, NSpace, DataTableRowKey } from 'naive-ui'
import { useTable } from '@/hooks/table'
import { tablePrefix } from '@/utils'
import { useLoadCommon } from '@/utils/CommForm'
import { RestartAltTwotone, AddCircleOutlineRound, NotStartedOutlined, StopCircleOutlined } from '@vicons/material'

const searchFormRef = ref<CommFormType | null>(null)

const commOptions = [
  {
    key: 'name',
    label: '任务名称',
    ftype: null,
    attrs: {
      onKeyup: (Event: any) => {
        if (Event.key == 'Enter') {
          searchFormRef.value?.submit()
        }
      }
    }
  },
  {
    key: 'state',
    label: '状态',
    ftype: null,
    type: NSelect,
    options: [
      { value: '1', label: '开启' },
      { value: '0', label: '关闭' }
    ],
    attrs: {
      afterOnUpdateValue: () => {
        searchFormRef.value?.submit()
      }
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
              searchFormRef.value?.submit()
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
              modalDialogRef.value?.toggle()
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
] as Array<OriginItem | Operation>
const formOptions = useLoadCommon(commOptions) as Array<FormItem>
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

const modalDialogRef = ref<ModalDialogType | null>(null)
const dataFormRef = ref<CommFormType | null>(null)
const selectEquipModalDialogRef = ref<ModalDialogType | null>(null)
const equipSearchFormRef = ref<CommFormType | null>(null)

import useBackupForm from './hooks/backup/useBackupForm'
const dataForm = useBackupForm({ doRefresh, modalDialogRef, dataFormRef, selectEquipModalDialogRef, equipSearchFormRef })
const { selectEquip } = dataForm
onMounted(() => searchFormRef.value?.submit())
</script>
