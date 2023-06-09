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
      ref="confFilesModalDialogRef"
      :style="{ height: '82vh', width: '76%', 'margin-top': '5vh' }"
      :on-after-leave="confFiles.modalDialogConfig.close"
      :footer="false"
    >
      <template #header> {{ confFiles.fileRowData.value?.name }} 设备信息 </template>
      <template #content>
        <n-descriptions
          label-style="font-weight: bold;"
          label-placement="left"
          :column="1"
          style="width: 80%; font-size: 16px; margin: 0.625rem auto 1.25rem auto"
        >
          <n-descriptions-item label="设备名称"> {{ confFiles.fileRowData.value?.name }} </n-descriptions-item>
          <n-descriptions-item label="设备IP"> {{ confFiles.fileRowData.value?.ip }} </n-descriptions-item>
        </n-descriptions>
        <n-data-table
          :data="confFiles.dataList"
          :columns="confFiles.tableColumns"
          :pagination="{
            prefix: tablePrefix,
            pageSize: 10,
            showSizePicker: true,
            pageSizes: [10, 30, 50]
          }"
          style="height: calc(100% - 6rem); width: 80%; margin: 0 auto"
          size="small"
          flex-height
        />
      </template>
    </ModalDialog>
  </div>
</template>

<script setup lang="ts">
import { CommFormType, OriginItem, FormItem, Operation, ModalDialogType } from '@/types/components'
import { DataTableColumn, useMessage, NButton, NIcon, NSpace } from 'naive-ui'
import { tablePrefix } from '@/utils'
import { useLoadCommon } from '@/utils/CommForm'
import { useTable, useTableColumn } from '@/hooks/table'
import { useGet } from '@/hooks/useApi'
import { get_net_filesList } from '@/api/url'
import { RestartAltTwotone } from '@vicons/material'

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
        )
      ])
  }
] as Array<OriginItem | Operation>
const formOptions = useLoadCommon(commOptions) as Array<FormItem>

const get = useGet()
const message = useMessage()

const doRefresh = () => {
  get({
    url: get_net_filesList,
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
  center: string
  code: string
  type: string
  backuptime: string
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
              confFilesModalDialogRef?.value?.toggle()
              confFiles.fileRowData.value = row
              confFiles.onSearch()
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
      title: '所属中心',
      key: 'center',
      width: 80
    },
    {
      title: '设备型号',
      key: 'code'
    },
    {
      title: '设备类型',
      key: 'type'
    },
    {
      title: '最近备份时间',
      key: 'backuptime'
    }
  ] as DataTableColumn[],
  {
    align: 'center'
  } as DataTableColumn
)
onMounted(() => searchFormRef.value?.submit())
const confFilesModalDialogRef = ref<ModalDialogType | null>(null)
import useConfFiles from './hooks/files/useConfFiles'
const confFiles = useConfFiles({ confFilesModalDialogRef })
</script>
