import { get_net_config_backupupdate } from '@/api/url'
import { FormItem, GridRender, Operation, OriginItem } from '@/types/components'
import { NSelect, useMessage, NButton, NTimePicker } from 'naive-ui'
import { usePost } from '@/hooks/useApi'
import type { DataTableRowKey } from 'naive-ui'
import { remove } from 'lodash-es'
import { arrClear } from '@/utils'
import useSelectEquip from './useSelectEquip'
import { useLoadCommon } from '@/utils/CommForm'

export default function ({ doRefresh, modalDialogRef, dataFormRef, selectEquipModalDialogRef }: any) {
  const modalDialogConfig = {
    title: '新建',
    close: () => {
      dataFormRef.value?.reset()
    }
  }

  const selectEquip = useSelectEquip({ dataFormRef, selectEquipModalDialogRef })

  const commOptions = [
    {
      key: 'name',
      label: '任务名称',
      ftype: null
    },
    {
      key: 'taskDescription',
      label: '任务描述',
      ftype: null
    },
    {
      key: 'time',
      label: '执行时间',
      style: {
        width: '100%'
      },
      formItemConfig: {
        showFeedback: false
      },
      value: reactive({
        type: null,
        time: null
      }),
      grid: [
        {
          key: 'type',
          render: (formItem: FormItem, gridRender: GridRender) =>
            h(NSelect, {
              style: { width: '40%' },
              options: [{ label: '每天', value: 'day' }],
              value: formItem.value[gridRender.key],
              onUpdateValue: (val) => {
                formItem.value[gridRender.key] = val
                console.log(formItem)
              }
            })
        },
        {
          key: 'time',
          render: (formItem: FormItem, gridRender: GridRender) =>
            h(NTimePicker, {
              style: {},
              value: formItem.value[gridRender.key],
              valueFormat: 'HH:mm',
              format: 'HH:mm',
              clearable: true,
              onUpdateValue: (val: any) => {
                formItem.value[gridRender.key] = val
                console.log(formItem)
              }
            })
        }
      ]
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
  ] as Array<OriginItem | Operation>

  const formOptions = useLoadCommon(commOptions) as Array<FormItem>
  const post = usePost()
  const message = useMessage()

  const submitConfirm = (obj: any) => {
    post({
      url: get_net_config_backupupdate,
      data: obj
    }).then((res) => {
      // if(res.code===201){
      message.success(res.msg)
      modalDialogRef?.value?.toggle()
      doRefresh()
      // }
    })
  }

  const selectEquipFormItem = formOptions.find((o: FormItem) => o.key === 'selectEquip')
  const checkedDataList = () => {
    return selectEquip.dataList.filter((d) => selectEquipFormItem?.value?.value?.includes(d.name))
  }
  const checkedSelectEquipRowKeys = ref<any[]>([])
  const updateCheckedSelectEquipRowKeys = (rowKeys: DataTableRowKey[]) => {
    checkedSelectEquipRowKeys.value = rowKeys
  }
  return {
    modalDialogConfig,
    formOptions,
    submitConfirm,
    selectEquip,
    checkedDataList,
    checkedSelectEquipRowKeys,
    updateCheckedSelectEquipRowKeys
  }
}
