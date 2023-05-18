import { FormItem, CommItem, Operation, OriginItem } from '@/types/components'
import { NInput, SelectOption } from 'naive-ui'
const renderCommon = (o: CommItem) => {
  !o.type && (o.type = NInput)
  const placeholder = o.type !== NInput ? o.placeholder || null : o.placeholder || '请输入' + o.label
  return {
    key: o.key,
    label: o.label,
    value: ref(o.type === NInput ? '' : null),
    optionItems: o.options,
    render: (formItem: FormItem) => {
      return h(o.type, {
        options: formItem.optionItems as Array<SelectOption>,
        value: formItem.value.value,
        clearable: true,
        onUpdateValue: (val: any) => {
          formItem.value.value = val
          o.attrs && 'afterOnUpdateValue' in o.attrs && typeof o.attrs.afterOnUpdateValue === 'function' && o.attrs.afterOnUpdateValue()
        },
        placeholder,
        ...o?.attrs
      })
    }
  }
}
function isOfType<T>(target: unknown, prop: keyof T): target is T {
  return (target as T)[prop] !== undefined
}

type Item = OriginItem | Operation
export const useLoadCommon = <T extends Item>(tempOptions: Array<T>) => {
  const formOptions: Array<FormItem | Operation> = []
  tempOptions.forEach((o) => formOptions.push(isOfType<CommItem>(o, 'ftype') ? (renderCommon(o) as FormItem) : o))
  return formOptions
}
