<script setup lang="ts">
import { ref } from 'vue'
import type { ButtonProps, ButtonEmits, ButtonInstance } from './types'
import { throttle } from 'lodash-es'

defineOptions({ name: 'HsButton' })

const props = withDefaults(defineProps<ButtonProps>(), {
    tag: 'button',
    nativeType: 'button',
    type: 'primary',
    size: 'default',
    plain: false,
    round: false,
    circle: false,
    loading: false,
    disabled: false,
    useThrottle: true,
    throttleDuration: 500,
})

const emits = defineEmits<ButtonEmits>()

const slots = defineSlots()

const _ref = ref<HTMLButtonElement>()

defineExpose<ButtonInstance>({
    ref: _ref
})

const handleBtnClick = (e: MouseEvent) => {
    emits('click', e)
}

const handleBtnClickThrottle = throttle(handleBtnClick, props.throttleDuration)

</script>

<template>
    <component
        ref="_ref"
        :is="tag"
        :type="tag === 'button' ? nativeType : void 0"
        :disabled="disabled || loading ? true : void 0"
        class="er-button"
        :class="{
            [`er-button--${type}`]: type,
            [`er-button--${size}`]: size,
            'is-plain': plain,
            'is-round': round,
            'is-circle': circle,
            'is-loading': loading,
            'is-disabled': disabled
        }"
        @click="(e: MouseEvent) => useThrottle ? handleBtnClickThrottle(e) : handleBtnClick(e)"
    >
        <slot></slot>
    </component>
</template>

<style scoped>
@import './style.css';
</style>