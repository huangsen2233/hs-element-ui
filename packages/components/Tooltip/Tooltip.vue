<script setup lang="ts">
import { ref, type Ref, computed } from 'vue'
import { debounce, type DebouncedFunc } from 'lodash-es'
import type { TooltipProps, TooltipEmits, TooltipInstance } from './types'

defineOptions({ name: "HsTooltip" })

const props = withDefaults(defineProps<TooltipProps>(), {
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
const triggerNode = ref<HTMLElement>()
const popperNode = ref<HTMLElement>()

const popperOptions = computed(() => ({
    placement: props.placement,
    modifiers: [
        {
            name: "offset",
            options: {
                offset: [0, 9],
            },
        },
    ],
    ...props.popperOptions,
}))

</script>

<template>
    <div class="er-tooltip" ref="containerNode" v-on="outerEvents">
        <div class="er-tooltip__trigger" ref="triggerNode" v-on="events" v-if="!virtualTriggering">
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