<script setup lang="ts">
import { ref, type Ref, computed, watchEffect, watch, onUnmounted } from 'vue'
import { bind, debounce, type DebouncedFunc } from 'lodash-es'
import { createPopper, type Instance } from "@popperjs/core";
import type { TooltipProps, TooltipEmits, TooltipInstance } from './types'
import { useClickOutside } from '@hs-element-ui/hooks'
import useEvenstToTiggerNode from './useEventsToTriggerNode';

interface _TooltipProps extends TooltipProps {
    virtualRef?: HTMLElement | void; // 虚拟触发节点
    virtualTriggering?: boolean; // 是否开启虚拟触发
}

defineOptions({ name: "HsTooltip" })

const props = withDefaults(defineProps<_TooltipProps>(), {
    placement: 'bottom',
    trigger: 'hover',
    transition: 'fade',
    showTimeout: 0,
    hideTimeout: 200
})

const emits = defineEmits<TooltipEmits>()

const visible = ref(false)

const containerNodeEvents: Ref<Record<string, EventListener>> = ref({})
const popperNodeEvents: Ref<Record<string, EventListener>> = ref({})
const triggerNodeEvents: Ref<Record<string, EventListener>> = ref({})

const containerNode = ref<HTMLElement>()
const popperNode = ref<HTMLElement>()
// 触发节点
const _triggerNode = ref<HTMLElement>()
const triggerNode = computed(() => {
    if (props.virtualRef) {
        return props.virtualRef ?? _triggerNode.value
    }
    return _triggerNode.value as HTMLElement;
})

// popper.js 的配置参数
const popperOptions = computed(() => ({
    placement: props.placement,
    modifiers: [
        {
            name: "offset",
            options: {
                offset: [0, 18],
            },
        },
    ],
    ...props.popperOptions,
}))

const openDelay = computed(() => props.trigger === 'hover' ? props.showTimeout : 0)
const closeDelay = computed(() => props.trigger === 'hover' ? props.hideTimeout : 0)

const triggerStrategyMap: Map<string, () => void> = new Map();
triggerStrategyMap.set("hover", () => {
    triggerNodeEvents.value["mouseenter"] = openFinal;
    containerNodeEvents.value["mouseleave"] = closeFinal;
    popperNodeEvents.value["mouseenter"] = openFinal;
});
triggerStrategyMap.set("click", () => {
    triggerNodeEvents.value["click"] = togglePopper;
});
triggerStrategyMap.set("contextmenu", () => {
    triggerNodeEvents.value["contextmenu"] = (e) => {
        e.preventDefault();
        openFinal();
    };
})

let popperInstance: null | Instance
function destroyPopperInstance() {
    popperInstance?.destroy()
    popperInstance = null
}

let openDebounce: DebouncedFunc<() => void> | void
let closeDebounce: DebouncedFunc<() => void> | void

function openFinal() {
    closeDebounce?.cancel() // debounce 函数返回的 cancel 方法可以取消延迟执行的函数
    openDebounce?.()
}

function closeFinal() {
    openDebounce?.cancel()
    closeDebounce?.()
}

// 切换 popper 的显示状态
function togglePopper() {
    visible.value ? closeFinal() : openFinal()
}

function setVisible(val: boolean) {
    if (props.disabled) return
    visible.value = val
    emits('visible-change', val)
}

// 重置事件监听器
function resetEvents() {
    triggerNodeEvents.value = {}
    containerNodeEvents.value = {}
    popperNodeEvents.value = {}
    attachEvents()
}

// 根据 trigger 触发方式绑定事件
function attachEvents() {
    if (props.disabled || props.manual) return
    triggerStrategyMap.get(props.trigger)?.()
}

const show: TooltipInstance['show'] = openFinal
const hide: TooltipInstance['hide'] = function() {
    openDebounce?.cancel()
    setVisible(false)
}

watchEffect(() => {
    if (!props.manual) {
        attachEvents()
    }
    openDebounce = debounce(bind(setVisible, null, true), openDelay.value)
    closeDebounce = debounce(bind(setVisible, null, false), closeDelay.value)
})

watch(visible, (val) => {
    if (!val) return
    if (triggerNode.value && popperNode.value) {
        popperInstance = createPopper(triggerNode.value, popperNode.value, popperOptions.value);
    }
}, { flush: 'post' })

watch(() => props.manual, (isManual) => {
    if (isManual) {
        resetEvents()
        return
    }
    attachEvents()
})

// 监听 trigger 触发方式变化
watch(() => props.trigger, (val, oldVal) => {
    console.log('[watch - trigger]', val, oldVal);
    if (val === oldVal) return
    openDebounce?.cancel()
    visible.value = false
    emits('visible-change', false)
    resetEvents()
})

useClickOutside(containerNode, () => {
    emits('click-outside')
    if (props.trigger === 'hover' || props.manual) return
    visible.value && closeFinal()
})

useEvenstToTiggerNode(props, triggerNode, triggerNodeEvents, () => {
    openDebounce?.cancel()
    setVisible(false)
})

onUnmounted(() => {
    destroyPopperInstance()
})

defineExpose<TooltipInstance>({
    show,
    hide,
})

</script>

<template>
    <div class="er-tooltip" ref="containerNode" v-on="containerNodeEvents">
        <div class="er-tooltip__trigger" ref="_triggerNode" v-on="triggerNodeEvents" v-if="!virtualTriggering">
            <slot></slot>
        </div>
        <slot name="default" v-else></slot>
        <transition :name="transition" @after-leave="destroyPopperInstance">
            <div class="er-tooltip__popper" ref="popperNode" v-on="popperNodeEvents" v-if="visible">
                <slot name="content">
                    {{ content }}
                </slot>
                <div id="arrow" data-popper-arrow></div>
            </div>
        </transition>
    </div>
</template>

<style scoped>
@import './style.css';
</style>