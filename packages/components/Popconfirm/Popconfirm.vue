<script setup lang="ts">
import { ref, computed } from 'vue'
import HsTooltip from '../Tooltip/Tooltip.vue'
import HsButton from '../Button/Button.vue'
import HsIcon from '../Icon/Icon.vue'
import { addUnit } from '@hs-element-ui/utils'
import { useLocale } from '@hs-element-ui/hooks'
import type { PopconfirmProps, PopconfirmEmits } from './types'
import type { TooltipInstance } from '../Tooltip'

defineOptions({ name: 'HsPopconfirm' })

const props = withDefaults(defineProps<PopconfirmProps>(), {
    title: '',
    confirmButtonType: 'primary',
    // confirmButtonText: 'Yes',
    // cancelButtonText: 'No',
    icon: 'question-circle',
    iconColor: '#f90',
    hideAfter: 200,
    width: 150
})

const emits = defineEmits<PopconfirmEmits>()

const tooltipRef = ref<TooltipInstance>()
const style = computed(() => ({ width: addUnit(props.width) }))

const locale = useLocale()

function hidePoper() {
    tooltipRef.value?.hide()
}

function confrim(e: MouseEvent) {
    emits('confirm', e)
    hidePoper()
}

function cancel(e: MouseEvent) {
    emits('cancel', e)
    hidePoper()
}
</script>

<template>
    <hs-tooltip ref="tooltipRef" trigger="click" :hide-timeout="hideAfter">
        <template #content>
            <div class="er-popconfirm" :style="style">
                <div class="er-popconfirm__main">
                    <hs-icon v-if="!hideIcon && icon" :icon="icon" :color="iconColor" />
                    {{ title }}
                </div>
                <div class="er-popconfirm__action">
                    <hs-button
                        class="er-popconfirm__cancel"
                        size="small"
                        :type="cancelButtonType"
                        @click="cancel"
                    >
                        {{ cancelButtonText || locale.t('popconfirm.cancelButtonText') }}
                    </hs-button>
                    <hs-button
                        class="er-popconfirm__confirm"
                        size="small"
                        :type="confirmButtonType"
                        @click="confrim"
                    >
                        {{ confirmButtonText || locale.t('popconfirm.confirmButtonText') }}
                    </hs-button>
                </div>
            </div>
        </template>

        <template v-if="$slots.default" #default>
            <slot name="default"></slot>
        </template>
        <template v-if="$slots.reference" #default>
            <slot name="reference"></slot>
        </template>
    </hs-tooltip>
</template>

<style scoped>
@import './style.css';
</style>