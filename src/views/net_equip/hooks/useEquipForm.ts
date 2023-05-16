import { get_net_config_backupupdate } from '@/api/url'
import { FormItem, CommItem } from '@/types/components'
import { useMessage } from 'naive-ui'
import { usePost } from '@/hooks/useApi'
import type { DataTableRowKey } from 'naive-ui'

export default function ({ doRefresh, itemModalDialogRef, itemDataFormRef }: any) {
  const modalDialogConfig = {
    title: '新建',
    close: () => {
      itemDataFormRef?.value?.reset()
    }
  }

  const itemFormOptions = [
    {
      key: 'name',
      label: '设备名称',
      ftype: 'common'
    },
    {
      key: 'supportor',
      label: '设备厂商',
      ftype: 'common'
    },
    {
      key: 'code',
      label: '设备型号',
      ftype: 'common'
    },
    {
      key: 'type',
      label: '设备类型',
      ftype: 'common'
    },
    {
      key: 'version',
      label: '软件版本',
      ftype: 'common'
    },
    {
      key: 'ip',
      label: '管理IP',
      ftype: 'common'
    },
    {
      key: 'dip',
      label: '带内管理IP',
      ftype: 'common'
    }
  ] as Array<FormItem | CommItem>
  const post = usePost()
  const message = useMessage()

  const submitConfirm = () => {
    const edit_info = itemDataFormRef?.value?.generatorParams()
    post({
      url: get_net_config_backupupdate,
      data: edit_info
    }).then((res) => {
      // if(res.code===201){
      message.success(res.msg)
      itemModalDialogRef?.value?.toggle()
      doRefresh()
      // }
    })
  }

  const checkedRowKeys = ref<any[]>([])
  const updateCheckedRowKeys = (rowKeys: DataTableRowKey[]) => {
    checkedRowKeys.value = rowKeys
  }
  return {
    modalDialogConfig,
    itemFormOptions,
    submitConfirm,
    checkedRowKeys,
    updateCheckedRowKeys
  }
}
