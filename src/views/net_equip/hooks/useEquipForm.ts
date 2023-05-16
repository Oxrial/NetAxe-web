import { get_net_config_equipupdate } from '@/api/url'
import { FormItem, CommItem } from '@/types/components'
import { useMessage, NSelect } from 'naive-ui'
import { usePost } from '@/hooks/useApi'
import type { DataTableRowKey } from 'naive-ui'
import type { FormRules } from 'naive-ui'
import { useLoadCommon } from '@/components/common/DataForm'
import _v from 'validator'

export default function ({ doRefresh, modalDialogRef, dataFormRef }: any) {
  const modalDialogConfig = {
    title: '新建',
    close: () => {
      dataFormRef?.value?.reset()
    }
  }

  const formOptions = useLoadCommon([
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
      key: 'center',
      label: '所属中心',
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
      ftype: 'common',
      type: NSelect
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
  ] as Array<CommItem>) as Array<FormItem>
  const rules = {
    name: {
      required: true,
      message: '请输入姓名',
      trigger: 'blur'
    },
    ip: {
      validator: _v.isIP,
      message: 'IP地址格式有误',
      trigger: 'blur'
    }
  } as FormRules
  const post = usePost()
  const message = useMessage()

  const submitConfirm = () => {
    const edit_info = dataFormRef?.value?.generatorParams()
    post({
      url: get_net_config_equipupdate,
      data: edit_info
    }).then((res) => {
      // if(res.code===201){opolp
      message.success(res.msg)
      modalDialogRef?.value?.toggle()
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
    formOptions,
    rules,
    submitConfirm,
    checkedRowKeys,
    updateCheckedRowKeys
  }
}
