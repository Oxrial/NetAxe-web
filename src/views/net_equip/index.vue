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
          labelWidth: 'auto',
          style: {
            display: 'flex'
          }
        }"
        preset="search"
        :options="formOptions"
        @submit="onSearch"
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
      :style="{ height: '60vh', width: '50%', 'margin-top': '7vh' }"
      :title="dataForm.modalDialogConfig.title"
      @confirm="dataFormRef?.submit"
      :on-after-leave="dataForm.modalDialogConfig.close"
    >
      <template #content>
        <CommForm
          ref="dataFormRef"
          :options="dataForm.formOptions"
          preset="dialog"
          :rules="dataForm.rules"
          :form-config="{
            labelWidth: 100,
            labelAlign: 'left'
          }"
          @submit="dataForm.submitConfirm"
        />
      </template>
    </ModalDialog>
  </div>
</template>

<script setup lang="ts">
import { CommFormType, ModalDialogType, FormItem, OriginItem, Operation } from '@/types/components'
import { DataTableColumn, useMessage, NButton, NIcon, NSpace } from 'naive-ui'
import { tablePrefix } from '@/utils'
import { useTable, useTableColumn } from '@/hooks/table'
import { useGet } from '@/hooks/useApi'
import { get_net_equipList } from '@/api/url'
import { RestartAltTwotone, AddCircleOutlineRound } from '@vicons/material'

const commOptions = [
  {
    key: 'name',
    label: '设备名称',
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
          { icon: () => h(NIcon, {}, () => h(AddCircleOutlineRound)), default: () => h('span', '增加设备') }
        )
      ])
  }
] as Array<OriginItem | Operation>
const formOptions = useLoadCommon(commOptions) as Array<FormItem>
const get = useGet()
const message = useMessage()

const doRefresh = () => {
  get({
    url: get_net_equipList,
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
let submitSearchData: object | null = null
const onSearch = (obj: any) => {
  submitSearchData = obj
  doRefresh()
}
const searchFormRef = ref<CommFormType | null>(null)
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
onMounted(() => searchFormRef.value?.submit())
const modalDialogRef = ref<ModalDialogType | null>(null)
const dataFormRef = ref<CommFormType | null>(null)
import useEquipForm from './hooks/useEquipForm'
import { useLoadCommon } from '@/utils/CommForm'
const dataForm = useEquipForm({ doRefresh, modalDialogRef, dataFormRef })
</script>
