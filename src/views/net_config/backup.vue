<script setup lang="ts" name="Backup">
import { useGet } from '@/hooks/useApi'
import { get_net_config_backupList } from '@/api/url'

import { DataFormType, ModalDialogType, FormItem } from '@/types/components'
import { DataTableColumn, NInput, NSelect, SelectOption, useMessage, NButton } from 'naive-ui'
import { useTable, useTableColumn } from '@/hooks/table'

const searchForm = ref<DataFormType | null>(null)
const conditionItems: Array<FormItem> = [
  {
    key: 'name',
    label: '任务名称',
    value: ref(''),
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
        },
        placeholder: ''
      })
    }
  },

  {
    key: 'state',
    label: '状态',
    value: ref(''),
    optionItems: [
      { value: '1', label: '开启' },
      { value: '0', label: '关闭' }
    ],
    render: (formItem) => {
      return h(NSelect, {
        options: formItem.optionItems as Array<SelectOption>,
        value: formItem.value.value,
        placeholder: '',
        onUpdateValue: (val) => {
          formItem.value.value = val
          onSearch()
        }
      })
    }
  }
]
let request_url = ''

const onResetSearch = () => {
  searchForm.value?.reset()
}
const onSearch = () => {
  const search_form = searchForm.value?.generatorParams()
  request_url = get_net_config_backupList + '?name=' + search_form.name + '&task=' + search_form.state
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
const rowKey = (rowData: any) => {
  return rowData.id
}
const tableColumns = reactive(
  useTableColumn(
    [
      {
        title: '任务名称',
        key: 'name'
      },
      {
        title: '状态',
        key: 'state',
        render: (rowData) => {
          if (rowData.state === '0') {
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
        key: 'backtime'
      },
      {
        title: '最新备份结果',
        key: 'backresult',
        render: (rowData) => {
          if (rowData.backresult) {
            return h(NButton, { type: 'error', size: 'tiny' }, () => h('span', {}, '失败'))
          } else {
            return h(NButton, { type: 'primary', size: 'tiny' }, () => h('span', {}, '成功'))
          }
        }
      }
    ],
    {
      align: 'center'
    } as DataTableColumn
  )
)

onMounted(() => {
  onSearch()
  // itemDataForm.modalDialogRef.value = backupModalDialogRef.value
  // itemDataForm.selectEquip.modalDialogRef.value = selectEquipModalDialogRef.value
  // itemDataForm.itemDataFormRef.value = itemDataFormRef.value
})
import useItemDataForm from './hooks/useItemDataForm'
const itemDataForm = useItemDataForm()
const { selectEquip } = itemDataForm
const backupModalDialogRef = ref<ModalDialogType | null>(null)
const selectEquipModalDialogRef = ref<ModalDialogType | null>(null)
const itemDataFormRef = ref<DataFormType | null>(null)
itemDataForm.useTriggerParent({
  useDoRefresh: () => doRefresh,
  useBackupModalDialogRef: () => computed(() => backupModalDialogRef.value),
  useSelectEquipModalDialogRef: () => computed(() => selectEquipModalDialogRef.value),
  useItemDataFormRef: () => computed(() => itemDataFormRef.value)
})
</script>

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
      <span class="operation-btn">
        <n-button size="small" type="info" @click="onSearch()">查询</n-button>
        <n-button size="small" type="success" @click="onResetSearch(), onSearch()">重置</n-button>
        <n-button type="primary" @click="backupModalDialogRef?.toggle" size="small">新建</n-button>
      </span>
      <n-data-table
        :loading="tableLoading"
        :data="dataList"
        :columns="tableColumns"
        :pagination="tablePagination"
        style="height: calc(100vh - 23rem)"
        :row-key="rowKey"
        flex-height
      />
    </n-card>
    <ModalDialog
      ref="backupModalDialogRef"
      :title="itemDataForm.modalDialogConfig.title + '备份任务'"
      @confirm="itemDataForm.submitConfirm"
      :style="{ height: '70vh', width: '55%', 'margin-top': '5vh' }"
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
      </template>
    </ModalDialog>
    <ModalDialog
      ref="selectEquipModalDialogRef"
      title="选择设备"
      contentHeight="100%"
      @confirm="selectEquip.submitConfirm"
      :style="{ height: '80vh', width: '75%', 'margin-top': '6vh' }"
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
                ref="equipSearchForm"
                :form-config="{
                  labelWidth: 80,
                  size: 'medium'
                }"
                preset="search"
                :options="selectEquip.equipSearchOptions"
              />
              <span class="operation-btn">
                <n-button size="small" type="info" @click="selectEquip.onSearch()">查询</n-button>
                <n-button size="small" type="success" @click="selectEquip.onResetSearch(), selectEquip.onSearch()">重置</n-button>
              </span>
              <n-data-table
                :loading="selectEquip.tableLoading.value"
                :data="selectEquip.dataList"
                :columns="selectEquip.tableColumns"
                :pagination="{
                  prefix: () => selectEquip.tablePaginationPrefix(),
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

<style scoped lang="scss">
.n-pagination {
  margin-top: 10px;
}
.operation-btn {
  .n-button {
    min-width: 80px;
  }
  .n-button + .n-button {
    margin-left: 10px;
  }
}
.n-data-table {
  :deep(.n-data-table__pagination) {
    justify-content: flex-start;
  }
}
</style>
