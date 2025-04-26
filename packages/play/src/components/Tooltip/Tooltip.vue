<script setup lang="ts">
import { ref, type Ref, computed, watchEffect, watch, onUnmounted, onMounted } from 'vue'
import { bind, debounce, type DebouncedFunc } from 'lodash-es'
import { createPopper, type Instance } from "@popperjs/core";
import type { TooltipProps, TooltipEmits, TooltipInstance } from './types'
import { useClickOutside } from '@hs-element-ui/hooks'
import useEvenstToTiggerNode from './useEventsToTriggerNode';

interface _TooltipProps extends TooltipProps {
    virtualRef?: HTMLElement | void; // 虚拟触发节点
    virtualTriggering?: boolean; // 是否开启虚拟触发
}

defineOptions({ name: "ErTooltip" })

const props = withDefaults(defineProps<_TooltipProps>(), {
    placement: 'bottom',
    trigger: 'hover',
    transition: 'fade',
    showTimeout: 0,
    hideTimeout: 200
})

const emits = defineEmits<TooltipEmits>()

const visible = ref(false)

const events: Ref<Record<string, EventListener>> = ref({})
const outerEvents: Ref<Record<string, EventListener>> = ref({})
const dropdownEvents: Ref<Record<string, EventListener>> = ref({})

const containerNode = ref<HTMLElement>()
const popperNode = ref<HTMLElement>()
const _triggerNode = ref<HTMLElement>()
const triggerNode = computed(() => {
    if (props.virtualTriggering) {
        return (props.virtualRef as HTMLElement) ?? _triggerNode.value;
    }
    return _triggerNode.value as HTMLElement;
});

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

const opneDelay = computed(() => props.trigger === 'hover' ? props.showTimeout : 0)
const closeDelay = computed(() => props.trigger === 'hover' ? props.hideTimeout : 0)

// 策略模式 - 表驱动
const triggerStrategyMap: Map<string, () => void> = new Map();
triggerStrategyMap.set("hover", () => {
    events.value["mouseenter"] = openFinal;
    outerEvents.value["mouseleave"] = closeFinal;
    dropdownEvents.value["mouseenter"] = openFinal;
});
triggerStrategyMap.set("click", () => {
    events.value["click"] = togglePopper;
});
triggerStrategyMap.set("contextmenu", () => {
    events.value["contextmenu"] = (e) => {
        e.preventDefault();
        openFinal();
    };
})

let popperInstance: null | Instance
function destroyPopperInstance() {
    // isNil 判断一个值是否为 null 或 undefined
    // if (isNil(popperInstance)) return
    popperInstance?.destroy()
    popperInstance = null
}

// 打开tooltip弹框
let openDebounce: DebouncedFunc<() => void> | void
// 关闭tooltip弹框
let closeDebounce: DebouncedFunc<() => void> | void

function openFinal() {
    closeDebounce?.cancel() // cancel，lodash的防抖函数附加方法，用于取消执行的函数
    openDebounce?.()
}

function closeFinal() {
    openDebounce?.cancel()
    closeDebounce?.()
}

function togglePopper() {
    visible.value ? closeFinal() : openFinal()
}

function setVisible(val: boolean) {
    if (props.disabled) return
    visible.value = val
    emits('visible-change', val)
}

function attachEvents() {
    if (props.disabled || props.manual) return
    triggerStrategyMap.get(props.trigger)?.()
}

function resetEvents() {
    events.value = {}
    outerEvents.value = {}
    dropdownEvents.value = {}   

    attachEvents()
}

const show: TooltipInstance['show'] = openFinal
const hide: TooltipInstance['hide'] = function() {
    openDebounce?.cancel()
    setVisible(false)
}

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

watch(() => props.trigger, (val, oldVal) => {
    if (val === oldVal) return
    openDebounce?.cancel()
    visible.value = false
    emits('visible-change', false)
    resetEvents()
})

// 点击外部关闭tooltip弹框
useClickOutside(containerNode, () => {
    emits('click-outside')
    if (props.trigger === 'hover' || props.manual) return
    visible.value && closeFinal() 
})

watchEffect(() => {
    if (!props.manual) {
        attachEvents()
    }
    openDebounce = debounce(bind(setVisible, null, true), opneDelay.value)
    closeDebounce = debounce(bind(setVisible, null, false), closeDelay.value)
})

useEvenstToTiggerNode(props, triggerNode, events, () => {
    openDebounce?.cancel()
    setVisible(false)
})

onUnmounted(() => {
    destroyPopperInstance()
})

defineExpose<TooltipInstance>({ show, hide })
</script>

<template>
    <div class="er-tooltip" ref="containerNode" v-on="outerEvents">
        <div class="er-tooltip__trigger" ref="_triggerNode" v-on="events" v-if="!virtualTriggering">
            <slot></slot>
        </div>
        <slot name="default" v-else></slot>
        <transition :name="transition" @after-leave="destroyPopperInstance">
            <div class="er-tooltip__popper" ref="popperNode" v-on="dropdownEvents" v-if="visible">
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