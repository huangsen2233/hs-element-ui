<script setup lang="ts">
import { ref, watch, watchEffect, provide } from 'vue'
import { debugWarn } from '@hs-element-ui/utils'
import { COLLAPSE_CTX_KEY } from './constants'
import type { CollapseEmits, CollapseProps, CollapseItemName } from './types'

const COMPONENT_NAME = 'HsCollapse' as const

defineOptions({ name: COMPONENT_NAME })

const props = withDefaults(defineProps<CollapseProps>(), {
    modelValue: () => [],
    accordion: false,
})
const emits = defineEmits<CollapseEmits>()

const activeNames = ref(props.modelValue)

function handleItemClick(item: CollapseItemName) {
    let _activeNames = [...activeNames.value]

    // 手风琴模式
    if (props.accordion) {
        _activeNames = [_activeNames[0] === item ? "" : item]
        updateActiveNames(_activeNames)
        return
    }

    const index = _activeNames.indexOf(item)
    if (index > -1) {
        _activeNames.splice(index, 1)
    } else {
        _activeNames.push(item)
    }
    updateActiveNames(_activeNames)
}

function updateActiveNames(newNames: CollapseItemName[]) {
    activeNames.value = newNames
    emits('update:modelValue', newNames)
    emits('change', newNames)
}

provide(COLLAPSE_CTX_KEY, {
    handleItemClick,
    activeNames,
})

watchEffect(() => {
    if (props.accordion && props.modelValue.length > 1) {
        debugWarn(COMPONENT_NAME, 'accordion mode should only have one active item')
    }
})

watch(
    () => props.modelValue,
    (newNames) => updateActiveNames(newNames)
)
</script>

<template>
    <div class="er-collapse">
        <slot></slot>
    </div>
</template>

<style scoped>
@import './style.css';
</style>