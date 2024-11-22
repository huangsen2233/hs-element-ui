<script setup lang="ts">
import { ref, computed, inject } from 'vue'
import { throttle } from 'lodash-es'
import HsIcon from '../Icon/Icon.vue'
import { BUTTON_GROUP_CTX_KEY } from './constants'
import type { ButtonProps, ButtonEmits, ButtonInstance } from './types'

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
    loadingIcon: 'spinner',
})

const ctx = inject(BUTTON_GROUP_CTX_KEY, void 0)

const type = computed(() => (ctx?.type ?? props.type ?? ''))
const size = computed(() => (ctx?.size ?? props.size ?? ''))
const disabled = computed(() => (ctx?.disabled ?? props.disabled ?? false))

const emits = defineEmits<ButtonEmits>()

const slots = defineSlots()

const _ref = ref<HTMLButtonElement>()

const iconStyle = computed(() => ({
    marginRight: slots.default ? '6px': '0'
}))

defineExpose<ButtonInstance>({
    ref: _ref,
    disabled,
    type,
    size,
})

const handleBtnClick = (e: MouseEvent) => {
    !props.loading && emits('click', e)
}

const handleBtnClickThrottle = throttle(handleBtnClick, props.throttleDuration, { trailing: false })

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
                    spin
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
        />

        <slot></slot>
    </component>
</template>

<style scoped>
@import './style.css';
</style>