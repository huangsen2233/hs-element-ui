<script setup lang="ts">
import { ref, computed, provide } from 'vue'
import { omit, isNil } from 'lodash-es'
import type { TooltipInstance } from '../Tooltip/types'
import { type ButtonInstance, ErButton as HsButton, ErButtonGroup as HsButtonGroup } from '../Button'
import type {
    DropdownProps,
    DropdownEmits,
    DropdownItemProps,
    DropdownContext,
    DropdownInstance,
} from './types'
import DropdownItem from './DropdownItem.vue'
import HsTooltip from '../Tooltip/Tooltip.vue'
import { DROPDOWN_CTX_KEY } from './constants'
import { useDisabledStyle } from '@hs-element-ui/hooks'

defineOptions({
    name: 'HsDropdown',
    inheritAttrs: false,
})

const props = withDefaults(defineProps < DropdownProps > (), {
    hideOnClick: true,
    items: () => [] as DropdownItemProps[],
})
const emits = defineEmits < DropdownEmits > ()
const slots = defineSlots()

const tooltipRef = ref < TooltipInstance > ()
const triggerRef = ref < ButtonInstance > ()
const virtualRef = computed(() => triggerRef.value?.ref ?? void 0)

const tooltipProps = computed(() =>
    omit(props, ['items', 'hideAfterClick', 'size', 'type', 'splitButton'])
)

function handleItemClick(e:DropdownItemProps) {
    props.hideOnClick && tooltipRef.value?.hide()
    !isNil(e.command) && emits('command', e.command)
}

// !TEST && useDisabledStyle()
useDisabledStyle()

provide<DropdownContext>(DROPDOWN_CTX_KEY, {
    handleItemClick,
    size: computed(() => props.size),
})

defineExpose < DropdownInstance > ({
    open: () => tooltipRef.value?.show(),
    close: () => tooltipRef.value?.hide()
})
</script>

<template>
    <div class="er-dropdown" :class="{ 'is-disabled': props.disabled }">
        <hs-tooltip 
            ref="tooltipRef" 
            v-bind="tooltipProps" 
            :virtual-triggering="splitButton"
            :virtual-ref="virtualRef?.value" 
            @visible-change="$emit('visible-change', $event)"
        >
            <hs-button-group v-if="splitButton" :type="type" :size="size" :disabled="disabled">
                <hs-button @click="$emit('click', $event)">
                    <slot name="default"></slot>
                </hs-button>
                <hs-button ref="triggerRef" icon="angle-down" />
            </hs-button-group>
            <slot name="default" v-else></slot>

            <template #content>
                <div class="er-dropdown__menu">
                    <slot name="dropdown">
                        <template v-for="item in items" :key="item.command">
                            <dropdown-item v-bind="item" />
                        </template>
                    </slot>
                </div>
            </template>
        </hs-tooltip>
    </div>
</template>

<style scoped>
@import "./style.css";

:deep(.er-button-group) {
    & > :last-child {
        padding: 5px 7px;
    }
}
</style>