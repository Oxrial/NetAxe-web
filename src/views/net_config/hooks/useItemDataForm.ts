import { get_net_config_backupupdate } from '@/api/url'
import { DataFormType, ModalDialogType, FormItem } from '@/types/components'
import { NInput, NSelect, useMessage, NButton, NTimePicker } from 'naive-ui'
import { usePost } from '@/hooks/useApi'
import useSelectEquip from './useSelectEquip'

export default function () {
  let parentObject: any = {}
  const useTriggerParent = (object: any) => (parentObject = object)

  // const modalDialogRef = ref<ModalDialogType | null>(null)
  const modalDialogConfig = reactive({
    title: '新建'
  })

  const selectEquip = useSelectEquip()
  selectEquip.useTriggerParent({
    useSelectEquipModalDialogRef: () => parentObject.useSelectEquipModalDialogRef()
  })

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
          maxlength: 50,
          placeholder: ''
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
          maxlength: 50,
          placeholder: ''
        })
      }
    },
    {
      key: 'time',
      label: '执行时间',
      value: ref(''),
      typeValue: ref(''),
      timeValue: ref(null),
      style: {
        width: '100%'
      },
      render: (formItem) => {
        return [
          h(NSelect, {
            style: { width: '30%', 'margin-right': '20px' },
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
            },
            placeholder: ''
          })
        ]
      }
    },
    {
      label: '设备选择',
      key: 'selectEquip',
      value: ref(selectEquip.submitChecked),
      render: () => {
        return h(
          NButton,
          {
            onClick: () => {
              parentObject.useSelectEquipModalDialogRef()?.value?.toggle()
              selectEquip.doMounted()
            }
          },
          () => h('span', 'TRIGGER')
        )
      }
    }
  ] as Array<FormItem>

  const post = usePost()
  const message = useMessage()

  const submitConfirm = () => {
    const edit_info = parentObject.useItemDataFormRef()?.value?.generatorParams()
    console.log(edit_info);
    
    // post({
    //   url: get_net_config_backupupdate,
    //   data: edit_info
    // }).then((res) => {
    //   console.log(res)
    //   // if(res.code===201){
    //   message.success(res.msg)
    //   modalDialogRef.value!.toggle()
    //   parentObject.doRefresh()
    //   // }
    // })
  }
  return {
    useTriggerParent,
    modalDialogConfig,
    // modalDialogTrigger,
    itemFormOptions,
    submitConfirm,
    // modalDialogRef,
    // itemDataFormRef,
    selectEquip
  }
}
