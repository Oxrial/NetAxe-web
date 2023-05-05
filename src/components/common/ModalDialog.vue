<template>
  <n-modal
    v-model:show="showModal"
    preset="card"
    :title="title"
    size="small"
    class="modal-dialog-wrapper"
    header-style="padding: 10px 20px"
    :mask-closable="false"
    :bordered="false"
    :style="bodyStyle"
    :segmented="segmented"
    display-directive="show"
  >
    <div :style="{ height: contentHeight }">
      <slot name="content" />
    </div>
    <template #footer>
      <div class="flex justify-end">
        <n-space>
          <n-button type="default" size="small" @click="onCancel">取消</n-button>
          <n-button type="primary" size="small" @click="onConfirm">确定</n-button>
        </n-space>
      </div>
    </template>
  </n-modal>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, ref, watchEffect } from 'vue'
import { useLayoutStore } from '..'
import { drag, unDrag } from '@/hooks/useDialogDragger'
import { CardSegmented } from 'naive-ui'

export default defineComponent({
  name: 'ModalDialog',
  props: {
    title: {
      type: String,
      default: '操作'
    },
    contentHeight: {
      type: String,
      default: '30vh'
    }
  },
  emits: ['confirm', 'cancel'],
  setup(props, { emit }) {
    const showModal = ref(false)
    const header = ref<HTMLElement | null>()
    const layoutStore = useLayoutStore()
    const bodyStyle = computed(() => ({
      width: layoutStore.state?.device === 'mobile' ? '80%' : '50%'
    }))
    const segmented: CardSegmented = {
      content: 'soft',
      footer: 'soft'
    }
    function toggle() {
      showModal.value = !showModal.value
      return Promise.resolve(showModal.value)
    }
    function show() {
      showModal.value = true
      return Promise.resolve(true)
    }
    function close() {
      showModal.value = false
      return Promise.resolve(false)
    }
    function onConfirm() {
      emit('confirm')
    }
    function onCancel() {
      showModal.value = false
      emit('cancel')
    }
    watchEffect(() => {
      if (showModal.value) {
        nextTick(() => {
          if (!header.value) {
            header.value = document.querySelector('.n-modal-container .n-card-header') as HTMLElement
          }
          drag(header.value)
        })
      } else {
        nextTick(() => {
          if (header.value) {
            unDrag(header.value as HTMLElement)
          }
        })
      }
    })
    return {
      showModal,
      bodyStyle,
      toggle,
      show,
      close,
      onConfirm,
      onCancel,
      segmented
    }
  }
})
</script>