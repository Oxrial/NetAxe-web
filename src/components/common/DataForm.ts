import { FormItem, CommItem } from './../../types/components'
import { FormProps, NForm, NInput, NFormItem, NFormItemGridItem, NGrid, useMessage } from 'naive-ui'
// import service from '@/api/axios.config'

function renderItem(formItem: FormItem) {
  return function () {
    if (formItem.render) {
      return formItem.required
        ? [
            formItem.render(formItem),
            h(
              'span',
              {
                class: 'ml-2 text-red-800 align-top'
              },
              '*'
            )
          ]
        : formItem.render(formItem)
    } else {
      return ''
    }
  }
}
interface CustomFormProps extends FormProps {
  split: number
  style: Object | string
}
export default defineComponent({
  name: 'DataForm',
  props: {
    formConfig: {
      type: Object as PropType<CustomFormProps>,
      default: () => {}
    },
    preset: {
      type: String,
      default: 'form-item',
      validator: (value: string) => {
        if (!['search', 'dialog', 'form-item', 'grid-item', 'grid-two-item'].includes(value)) {
          console.error('preset value must be `form-item` or `grid-item` or `grid-two-item`, the default value is `form-item`')
          return false
        }
        return true
      }
    },
    options: {
      type: Array as PropType<Array<FormItem | CommItem>>,
      require: true
    }
  },
  setup(props) {
    const dataForm = ref<typeof NForm | null>(null)

    // if ftype=common type NInput
    function renderCommon(o: CommItem) {
      return {
        key: o.key,
        label: o.label,
        value: ref(''),
        render: (formItem: FormItem) => {
          return h(o.type || NInput, {
            value: formItem.value.value,
            clearable: true,
            onUpdateValue: (val: any) => {
              formItem.value.value = val
            },
            ...o.attrs
          })
        }
      } as FormItem
    }
    const optionsRender = ref<Array<any>>([])

    // const options = ref<Array<FormItem>[]>(optionsT)
    const message = useMessage()
    watch(
      () => props.options,
      (n) => {
        n &&
          n.forEach((o) => {
            if (o.ftype && ['common'].includes(o.ftype)) {
              optionsRender.value.push(renderCommon(o as CommItem))
            } else {
              optionsRender.value.push(o)
            }
          })
      },
      {
        immediate: true
      }
    )

    function reset() {
      if (!optionsRender.value) return
      optionsRender.value.forEach((it: FormItem) => {
        if (it.reset) {
          it.reset(it)
        } else {
          it.value.value = ''
        }
      })
    }

    function generatorParams() {
      if (!optionsRender.value) return
      return optionsRender.value
        .filter((o) => !!o.value)
        .reduce((pre: any, cur: FormItem) => {
          pre[cur.key] = cur.value.value
          return pre
        }, {})
    }

    function validator() {
      if (!optionsRender.value) return
      return optionsRender.value.every((it: FormItem) => {
        if (it.required) {
          if (it.validator) {
            return it.validator(it, message)
          }
          if (it.value.value) {
            return true
          }
          message.error(it.label + '不能为空')
          return false
        }
        return true
      })
    }

    return {
      optionsRender: optionsRender.value,
      dataForm,
      reset,
      validator,
      generatorParams
    }
  },
  render() {
    if (!this.options) {
      throw new Error('prop options must be not null')
    }
    interface FormStyle {
      [key: string]: Object
    }
    const formStyleEnums: FormStyle = {
      search: {
        display: 'inline-flex'
      },
      dialog: {
        padding: '10px 0 10px 20px',
        display: 'flex',
        width: '80%',
        margin: '0 auto',
        'flex-direction': 'row',
        'flex-wrap': 'wrap'
      }
    }
    return h(
      NForm,
      {
        ref: 'dataForm',
        labelPlacement: 'left',
        ...this.formConfig,
        style: {
          ...(this.formConfig.style as Object),
          ...formStyleEnums[this.preset]!
        }
      },
      {
        default: () => {
          return this.preset === 'grid-item'
            ? h(
                NGrid,
                {
                  responsive: 'screen',
                  cols: '4',
                  xGap: 5
                },
                {
                  default: () => {
                    return this.optionsRender?.map((it) => {
                      return h(
                        NFormItemGridItem,
                        {
                          label: it.label
                        },
                        {
                          default: renderItem(it as FormItem)
                        }
                      )
                    })
                  }
                }
              )
            : this.preset === 'grid-two-item'
            ? h(
                NGrid,
                {
                  responsive: 'screen',
                  cols: '2',
                  xGap: 20
                },
                {
                  default: () => {
                    return this.optionsRender?.map((it) => {
                      return h(
                        NFormItemGridItem,
                        {
                          label: it.label,
                          style: it.style
                        },
                        {
                          default: renderItem(it)
                        }
                      )
                    })
                  }
                }
              )
            : this.preset === 'dialog'
            ? this.optionsRender?.map((it) => {
                return h(
                  NFormItem,
                  {
                    label: it.label,
                    path: it.path || (it.key as string),
                    ...it.formItemConfig,
                    style: {
                      width: `calc(100% / ${this.formConfig.split || 2} - ${((this.formConfig.split || 2) - 1) * 20}px)`,
                      'margin-right': '20px',
                      ...it.style
                    }
                  },
                  {
                    default: renderItem(it)
                  }
                )
              })
            : this.preset === 'search'
            ? this.optionsRender?.map((it) => {
                return h(
                  NFormItem,
                  {
                    label: it.label,
                    path: it.path || (it.key as string),
                    ...it.formItemConfig,
                    style: {
                      'min-width': `${220 + Number(this.formConfig.labelWidth)}px`,
                      'margin-right': '20px',
                      ...it.style
                    }
                  },
                  {
                    default: renderItem(it)
                  }
                )
              })
            : this.optionsRender?.map((it) => {
                return h(
                  NFormItem,
                  {
                    label: it.label,
                    path: it.path || (it.key as string),
                    ...it.formItemConfig
                  },
                  {
                    default: renderItem(it)
                  }
                )
              })
        }
      }
    )
  }
})
