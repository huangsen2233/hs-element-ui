<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ButtonProps, ButtonEmits, ButtonInstance } from './types'
import { throttle } from 'lodash-es'
import HsIcon from '../Icon/Icon.vue'

defineOptions({ name: 'HsButton' })

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
    // loadingIcon: 'spinner',
})

const emits = defineEmits<ButtonEmits>()

const slots = defineSlots()

const _ref = ref<HTMLButtonElement>()

const iconStyle = computed(() => ({
    marginRight: slots.default ? '6px': '0'
}))

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
        <!-- loading 图标 -->
        <template v-if="loading">
            <slot name="loading">
                <hs-icon
                    class="loading-icon"
                    :icon="loadingIcon ?? 'spinner'"
                    :style="iconStyle"
                    size="1x"
                ></hs-icon>
            </slot>
        </template>
        <!-- 传入的图标 -->
        <hs-icon
            v-if="icon && !loading"
            :icon="icon"
            :style="iconStyle"
            size="1x"
        ></hs-icon>
        <slot></slot>
    </component>
</template>

<style scoped>
@import './style.css';
</style>