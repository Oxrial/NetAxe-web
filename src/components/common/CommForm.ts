import { cloneDeep } from 'lodash-es'
import { FormItem } from './../../types/components'
import { FormProps, NGrid, NForm, NFormItem, FormValidationError, NFormItemGi } from 'naive-ui'
import type { FormRules } from 'naive-ui'
// import service from '@/api/axios.config'

interface CustomFormProps extends FormProps {
  split: number
  style: Object | string
}

export default defineComponent({
  name: 'CommForm',
  props: {
    formConfig: {
      type: Object as PropType<CustomFormProps>,
      default: () => {}
    },
    preset: {
      type: String,
      default: 'search',
      validator: (value: string) => {
        if (!['search', 'dialog'].includes(value)) {
          console.error('preset value must be `search` or `dialog`, the default value is `search`')
          return false
        }
        return true
      }
    },
    options: {
      type: Array as PropType<Array<FormItem>>,
      require: true
    },
    rules: {
      type: Object as PropType<FormRules>,
      default: () => {
        return {}
      }
    }
  },
  emits: ['submit'],
  setup(props, ctx) {
    const commFormRef = ref<typeof NForm | null>(null)
    const options = toRef(props, 'options')
    function reset() {
      if (!options.value) return
      commFormRef.value?.restoreValidation()
      options.value.forEach((it: FormItem) => {
        if (it.value) {
          if (it.reset) {
            it.reset(it)
          } else {
            isRef(it.value) && (it.value.value = value_origin[it.key])
            if (isReactive(it.value)) {
              if (!it.render && 'grid' in it && Array.isArray(it.grid)) {
                it.grid.forEach((i) => {
                  it.value[i.key] = value_origin[it.key][i.key]
                })
              }
            }
          }
        }
      })
    }
    function generatorParams() {
      if (!options.value) return
      return options.value
        .filter((o) => !!o.value)
        .reduce((pre: any, cur: FormItem) => {
          isRef(cur.value) && (pre[cur.key] = cur.value.value)
          isReactive(cur.value) && (pre[cur.key] = toRaw(cur.value))
          return pre
        }, {})
    }
    function submit() {
      if (!options.value) return
      if (Object.getOwnPropertyNames(commFormRef.value?.rules).length) {
        commFormRef.value?.validate((errors: Array<FormValidationError>) => {
          if (!errors) {
            ctx.emit('submit', generatorParams())
          } else {
            console.log(errors)
          }
        })
      } else {
        ctx.emit('submit', generatorParams())
      }
    }
    let value_origin: any = null
    onMounted(() => {
      value_origin = cloneDeep(generatorParams())
    })
    return {
      generatorParams,
      commFormRef,
      submit,
      reset
    }
  },
  render() {
    const renderFormItemConfig = (it: FormItem) => {
      const obj = {
        label: it.label,
        ...it.formItemConfig
      }
      switch (this.preset) {
        case 'dialog':
          obj.style = {
            width: `calc(100% / ${this.formConfig.split || 2} - ${((this.formConfig.split || 2) - 1) * 20}px)`,
            'margin-right': '20px',
            ...it.style
          }
          if (!('grid' in it)) {
            obj.path = it.key as string
          }
          break
        case 'search':
          obj.style = {
            'min-width': `${220 + Number(this.formConfig.labelWidth)}px`,
            'margin-right': '20px',
            ...it.style
          }
          if (!('grid' in it)) {
            obj.path = it.key as string
          }
          break
      }
      return obj
    }
    const renderDefault = (it: FormItem) => {
      if (!it.render && 'grid' in it && Array.isArray(it.grid)) {
        return h(
          NGrid,
          {
            responsive: it.gridConfig?.responsive || 'self',
            cols: it.gridConfig?.cols || '4',
            xGap: it.gridConfig?.xGap || 20,
            yGap: it.gridConfig?.yGap || 0,
            itemResponsive: true
          },
          {
            default: () => {
              const arr: VNode[] = []
              it.grid!.forEach((i) => {
                arr.push(h(NFormItemGi, { path: [it.key] + '' + [i.key] }, () => i.render(it, i)))
              })
              return arr
            }
          }
        )
      } else {
        return it.render ? it.render(it) : ''
      }
    }
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
        ref: 'commFormRef',
        labelPlacement: 'left',
        labelAlign: 'right',
        requireMarkPlacement: 'right-hanging',
        rules: this.rules,
        model: this.generatorParams(),
        showFeedback: true,
        ...this.formConfig,
        style: {
          ...(this.formConfig.style as Object),
          ...formStyleEnums[this.preset]!
        }
      },
      {
        default: () => {
          return this.options?.map((it) => {
            return h(NFormItem, renderFormItemConfig(it), {
              default: () => renderDefault(it)
            })
          })
        }
      }
    )
  }
})
