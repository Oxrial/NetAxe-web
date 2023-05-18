import { get_net_config_equipupdate } from '@/api/url'
import { FormItem, OriginItem } from '@/types/components'
import { useMessage, NSelect, NInput } from 'naive-ui'
import { usePost } from '@/hooks/useApi'
import type { DataTableRowKey } from 'naive-ui'
import type { FormRules, FormItemRule } from 'naive-ui'
import { useLoadCommon } from '@/utils/CommForm'
import _v from 'validator'

export default function ({ doRefresh, modalDialogRef, dataFormRef }: any) {
  const modalDialogConfig = {
    title: '新建',
    close: () => {
      dataFormRef?.value?.reset()
    }
  }
  const commOptions = [
    {
      key: 'name',
      label: '设备名称',
      ftype: null
    },
    {
      key: 'supportor',
      label: '设备厂商',
      type: NSelect,
      ftype: null
    },
    {
      key: 'center',
      label: '所属中心',
      type: NSelect,
      ftype: null
    },
    {
      key: 'code',
      label: '设备型号',
      ftype: null
    },
    {
      key: 'type',
      label: '设备类型',
      type: NSelect,
      ftype: null
    },
    {
      key: 'version',
      label: '软件版本',
      ftype: null
    },
    {
      key: 'ip',
      label: '管理IP',
      placeholder: '请输入带外管理IP',
      ftype: null
    },
    {
      key: 'dip',
      label: '带内管理IP',
      ftype: null
    }
  ] as Array<OriginItem>
  const formOptions = useLoadCommon(commOptions) as Array<FormItem>

  const ipRule = [
    {
      validator: (rule: FormItemRule, value: any) => !value || _v.isIP(value),
      message: 'IP地址格式有误',
      trigger: 'blur'
    }
  ]
  const rules = reactive({
    ip: [...ipRule],
    dip: [...ipRule]
  } as FormRules)
  commOptions.forEach(
    (f) =>
      ['name', 'supportor', 'center', 'code', 'type'].includes(f.key as string) &&
      !(f.key in rules) &&
      (rules[f.key] = {
        required: true,
        message: (f.type && f.type !== NInput ? '请选择' : '请输入') + f.label,
        trigger: 'blur'
      })
  )
  const post = usePost()
  const message = useMessage()

  const submitConfirm = (obj: any) => {
    post({
      url: get_net_config_equipupdate,
      data: obj
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
