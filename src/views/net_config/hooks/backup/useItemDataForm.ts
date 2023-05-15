import { get_net_config_backupupdate } from '@/api/url'
import { FormItem } from '@/types/components'
import { NInput, NSelect, useMessage, NButton, NTimePicker } from 'naive-ui'
import { usePost } from '@/hooks/useApi'
import type { DataTableRowKey } from 'naive-ui'
import { remove } from 'lodash-es'
import { arrClear } from '@/utils'
import useSelectEquip from './useSelectEquip'

export default function ({ doRefresh, backupModalDialogRef, itemDataFormRef, selectEquipModalDialogRef }: any) {
  const modalDialogConfig = {
    title: '新建',
    close: () => {
      itemDataFormRef?.value?.reset()
      const time = itemDataFormRef?.value?.options.find((o: FormItem) => o.key === 'time')
      time.typeValue.value = ''
      time.timeValue.value = null
    }
  }

  const selectEquip = useSelectEquip({ itemDataFormRef, selectEquipModalDialogRef })

  const itemFormOptions = [
    {
      key: 'name',
      label: '任务名称',
      value: ref(''),
      render: (formItem) => {
        return h(NInput, {
          value: formItem.value.value,
          onUpdateValue: (newVal: any) => {
            formItem.value.value = newVal
          },
          maxlength: 50
        })
      }
    },
    {
      key: 'taskDescription',
      label: '任务描述',
      value: ref(''),
      render: (formItem) => {
        return h(NInput, {
          value: formItem.value.value,
          onUpdateValue: (newVal: any) => {
            formItem.value.value = newVal
          },
          maxlength: 50
        })
      }
    },
    {
      key: 'time',
      label: '执行时间',
      value: ref(null),
      typeValue: ref(null),
      timeValue: ref(null),
      style: {
        width: '100%'
      },
      render: (formItem) => {
        return [
          h(NSelect, {
            style: { width: '30%', 'margin-right': '1.25rem' },
            options: [{ label: '每天', value: 'day' }],
            value: formItem.typeValue.value,
            onUpdateValue: (val) => {
              formItem.typeValue.value = val
              formItem.value.value = formItem.typeValue.value + formItem.timeValue.value
            }
          }),
          h(NTimePicker, {
            style: { width: '30%' },
            value: formItem.timeValue.value,
            format: 'HH:mm',
            onUpdateValue: (val: any) => {
              formItem.timeValue.value = val
              formItem.value.value = formItem.typeValue.value + formItem.timeValue.value
            }
          })
        ]
      }
    },
    {
      label: '设备选择',
      key: 'selectEquip',
      value: ref<Array<string>>([]),
      render: (formItem) => {
        return [
          h(
            NButton,
            {
              style: {
                'margin-right': '1.25rem'
              },
              onClick: () => {
                selectEquipModalDialogRef?.value
                  .toggle()
                  .then((res: boolean) => res && formItem.value.value.length && selectEquip.checkedRowKeys.value.push(...formItem.value.value))
                selectEquip.doMounted()
              }
            },
            () => h('span', '设备选择')
          ),
          h(
            NButton,
            {
              onClick: () => {
                remove(selectEquipFormItem?.value?.value, (s) => checkedSelectEquipRowKeys.value.includes(s))
                arrClear(checkedSelectEquipRowKeys.value)
              }
            },
            () => h('span', '删除')
          )
        ]
      }
    }
  ] as Array<FormItem>
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
      backupModalDialogRef?.value?.toggle()
      doRefresh()
      // }
    })
  }

  const selectEquipFormItem = itemFormOptions.find((o: FormItem) => o.key === 'selectEquip')
  const checkedDataList = () => {
    return selectEquip.dataList.filter((d) => selectEquipFormItem?.value?.value?.includes(d.name))
  }
  const checkedSelectEquipRowKeys = ref<any[]>([])
  const updateCheckedSelectEquipRowKeys = (rowKeys: DataTableRowKey[]) => {
    checkedSelectEquipRowKeys.value = rowKeys
  }
  return {
    modalDialogConfig,
    itemFormOptions,
    submitConfirm,
    selectEquip,
    checkedDataList,
    checkedSelectEquipRowKeys,
    updateCheckedSelectEquipRowKeys
  }
}
