<script lang="ts" setup>
import { ref } from 'vue'
import { throttle } from 'lodash-es'
import type { ButtonProps, ButtonEmits, ButtonInstance } from './types'
import ErIcom from '../components/Icon/Icon.vue'

defineOptions({
    name: 'ErButton',
})

const props = withDefaults(defineProps<ButtonProps>(), {
    tag: 'button',
    type: 'primary',
    size: 'default',
    nativeType: 'button',
    disabled: false,
    loading: false,
    plain: false,
    round: false,
    circle: false,
    autofocus: false,
    useThrottle: true,
    throttleDuration: 500,
    icon: '',
    loadingIcon: 'spinner',
})

const emits = defineEmits<ButtonEmits>(
    
)

const slots = defineSlots()

const _ref = ref<HTMLButtonElement>()

const handleBtnClick = (e: MouseEvent) => emits('click', e)

const handleBtnClickThrottle = throttle(handleBtnClick, props.throttleDuration)

defineExpose<ButtonInstance>({
    ref: _ref,
    disabled: props.disabled,
    type: props.type,
    size: props.size,
})
</script>

<template>
    <component
        ref="_ref"
        :is="tag"
        :autofocus="autofocus"
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