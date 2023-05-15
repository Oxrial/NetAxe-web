<script setup lang="ts">
const showModal = ref(false)
interface ModalProp {
  title: string
  style: object
  size: 'medium' | 'small' | 'large' | 'huge'
  maskClosable: boolean
  preset: 'card' | 'dialog'
  segmented: object
  displayDirective: 'show' | 'if'
  closeOnEsc: boolean
  to: string | HTMLElement
  noAfterEnter: () => void
  onAfterLeave: () => void
  bordered: boolean
  headerStyle: object
  contentStyle: object
}
withDefaults(defineProps<ModalProp>(), {
  title: '',
  style: () => {
    return {}
  },
  size: 'medium',
  maskClosable: false,
  preset: 'card',
  segmented: () => {
    return {
      content: 'soft',
      footer: 'soft'
    }
  },
  displayDirective: 'if',
  closeOnEsc: false,
  to: 'body',
  bordered: false
})
const emit = defineEmits(['confirm', 'close'])
const onConfirm = () => emit('confirm')
const onClose = () => emit('close')
</script>

<template>
  <n-modal
    v-model:show="showModal"
    :title="title"
    :size="size"
    :header-style="{ ...headerStyle, padding: '10px 20px' }"
    :preset="preset"
    :bordered="bordered"
    :style="style"
    :to="to"
    :segmented="segmented"
    :mask-closable="maskClosable"
    :display-directive="displayDirective"
    :close-on-esc="closeOnEsc"
    :on-after-enter="noAfterEnter"
    :on-after-leave="onAfterLeave"
  >
    <template #header-extra>
      <slot name="header-extra" />
    </template>
    <div :style="{ ...contentStyle, height: '30vh' }">
      <slot />
    </div>
    <template #footer>
      <div class="flex justify-end">
        <n-space>
          <n-button type="default" size="small" @click="onClose">取消</n-button>
          <n-button type="primary" size="small" @click="onConfirm">确定</n-button>
        </n-space>
      </div>
    </template>
  </n-modal>
</template>

<style scoped lang="scss"></style>
