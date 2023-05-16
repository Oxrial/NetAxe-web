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
        ref="searchFormRef"
        :form-config="{
          labelWidth: 'auto',
          style: {
            display: 'flex'
          }
        }"
        preset="search"
        :options="searchOptions"
      />
      <n-data-table
        :loading="tableLoading"
        :data="dataList"
        :columns="tableColumns"
        :pagination="{
          prefix: tablePrefix,
          pageSize: 10,
          showSizePicker: true,
          pageSizes: [10, 30, 50]
        }"
        size="small"
        style="height: calc(100vh - 16rem)"
        flex-height
      />
    </n-card>
    <ModalDialog
      ref="modalDialogRef"
      :style="{ height: '60vh', width: '60%', 'margin-top': '7vh' }"
      :title="dataForm.modalDialogConfig.title"
      @confirm="dataForm.submitConfirm"
      :on-after-leave="dataForm.modalDialogConfig.close"
    >
      <template #content>
        <DataForm
          ref="dataFormRef"
          :options="dataForm.formOptions"
          preset="dialog"
          :form-config="{
            labelWidth: 100,
            labelAlign: 'left',
            rules: dataForm.rules
          }"
        />
      </template>
    </ModalDialog>
  </div>
</template>

<script setup lang="ts">
import {
  DataFormType,
  ModalDialogType,
  FormItem,
  ModalDialogType,
  Operation
  // , ModalDialogType
} from '@/types/components'
import { DataTableColumn, NInput, NSelect, SelectOption, useMessage, NButton, NIcon, NSpace } from 'naive-ui'
import { tablePrefix } from '@/utils'
import { useTable, useTableColumn } from '@/hooks/table'
import { useGet } from '@/hooks/useApi'
import { get_net_equipList } from '@/api/url'
import { RestartAltTwotone, AddCircleOutlineRound } from '@vicons/material'

const searchOptions: Array<FormItem | Operation> = [
  {
    key: 'column',
    label: '',
    value: ref(''),
    formItemConfig: {
      labeWidth: '10px'
    },
    style: {
      minWidth: 'unset'
    },
    reset: (formItem: FormItem) => (formItem.value = ''),
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
    render: (formItem: FormItem) => {
      return h(NSelect, {
        style: { width: '7.5rem' },
        value: formItem.value,
        clearable: true,
        options: formItem.optionItems as Array<SelectOption>,
        placeholder: '过滤条件',
        onUpdateValue: (val) => {
      console.log('s',formItem);
          formItem.value = val
        }
      })
    }
  },
  {
    key: 'filterValue',
    label: '',
    value: ref(''),
    render: (formItem: FormItem) => {
      console.log(formItem);
      return h(NInput, {
        value: formItem.value.value,
        clearable: true,
        onUpdateValue: (val) => {
      console.log('s',formItem.value);
          formItem.value = val
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
              modalDialogRef.value?.toggle()
            }
          },
          { icon: () => h(NIcon, {}, () => h(AddCircleOutlineRound)), default: () => h('span', '增加设备') }
        )
      ])
  }
]
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
const searchFormRef = ref<DataFormType | null>(null)
const onResetSearch = () => {
  searchFormRef.value?.reset()
}
export interface RowData {
  name: string
  ip: string
  type: string
  center: string
  version: string
  code: string
}
const table = useTable()
const { tableLoading, dataList } = table
const tableColumns = useTableColumn(
  [
    {
      title: '设备名称',
      key: 'name',
      render: (row: RowData) =>
        h(
          'span',
          {
            style: { color: '#4098fc', cursor: 'pointer' },
            onClick: () => {
              // confFilesModalDialogRef?.value?.toggle()
              // confFiles.fileRowData.value = row
              // confFiles.onSearch()
            }
          },
          row.name + ''
        )
    },
    {
      title: 'IP地址',
      key: 'ip',
      ellipsis: true,
      width: 135
    },
    {
      title: '设备类型',
      key: 'type'
    },
    {
      title: '所属中心',
      key: 'center',
      width: 80
    },
    {
      title: '软件版本',
      key: 'version'
    },
    {
      title: '设备型号',
      key: 'code'
    }
  ] as DataTableColumn[],
  {
    align: 'center'
  } as DataTableColumn
)
onMounted(onSearch)
const modalDialogRef = ref<ModalDialogType | null>(null)
const dataFormRef = ref<DataFormType | null>(null)
import useEquipForm from './hooks/useEquipForm'
const dataForm = useEquipForm({ doRefresh, modalDialogRef, dataFormRef })

</script>
