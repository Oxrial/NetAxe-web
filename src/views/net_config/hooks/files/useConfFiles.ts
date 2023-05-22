import { useTable, useTableColumn } from '@/hooks/table'
import { DataTableColumn, NIcon, useMessage, NButton } from 'naive-ui'
import { useGet } from '@/hooks/useApi'
import { get_net_conf_files_list } from '@/api/url'
import { RowData as FileRowData } from '../../files.vue'
import { FileDownload } from '@vicons/fa'

export default function ({ confFilesModalDialogRef }: any) {
  const fileRowData = ref<FileRowData | null>(null)
  const modalDialogConfig = {
    close: () => {
      fileRowData.value = null
    }
  }
  interface RowData {
    fileName?: string
    backuptime?: string
  }
  const table = useTable()
  const tableColumns = useTableColumn(
    [
      {
        title: '名称',
        key: 'fileName'
      },
      {
        title: '备份时间',
        key: 'backuptime'
      },
      {
        title: '操作',
        key: 'operation',
        style: {
          background: 'pink'
        },
        render: (row: RowData) =>
          h(
            NButton,
            {
              type: 'info',
              size: 'small',
              onClick: () => {
                console.log(row)
              }
            },
            { icon: () => h(NIcon, {}, () => h(FileDownload)), default: () => h('span', '下载') }
          )
      }
    ] as DataTableColumn[],
    { align: 'center' } as DataTableColumn
  )
  const submitConfirm = () => {
    confFilesModalDialogRef?.value?.toggle()
  }
  const get = useGet()
  const message = useMessage()
  const doRefresh = () => {
    get({
      url: get_net_conf_files_list,
      data: () => {
        return {
          fileName: fileRowData.value?.name,
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
  return {
    modalDialogConfig,
    ...table,
    tableColumns,
    submitConfirm,
    fileRowData,
    onSearch
  }
}
