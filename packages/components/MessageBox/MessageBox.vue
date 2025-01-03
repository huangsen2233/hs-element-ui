<script setup lang="ts">
import type { MessageBoxProps, MessageBoxAction } from "./types";
import type { InputInstance } from "../Input/types";
import { useZIndex, useId } from "@hs-element-ui/hooks";
import { typeIconMap } from "@hs-element-ui/utils";
import { reactive, computed, ref, watch, nextTick, type Ref } from "vue";
import HsOverlay from "../Overlay/Overlay.vue";
import HsIcon from "../Icon/Icon.vue";
import HsButton from "../Button/Button.vue";
import HsInput from "../Input/Input.vue";
import { isFunction, isNil } from "lodash-es";

defineOptions({
    name: "HsMessageBox",
    inheritAttrs: false,
});

const props = withDefaults(defineProps<MessageBoxProps>(), {
    lockScroll: true,
    showClose: true,
    closeOnClickModal: true, // 是否可通过点击遮罩层关闭 MessageBox
    confirmButtonType: "primary",
    roundButton: false,
    boxType: "",
    inputValue: "",
    inputPlaceholder: "Please input...",
    confirmButtonText: "Ok",
    cancelButtonText: "Cancel",
    showConfirmButton: true,
});

const { doAction } = props;
const { nextZIndex } = useZIndex();

const headerRef = ref<HTMLElement>();
const inputRef = ref<InputInstance>();
const inputId = useId();

const state = reactive({
    ...props,
    zIndex: nextZIndex(),
});

const hasMessage = computed(() => !!state.message);
const iconComponent = computed(
    () => state.icon ?? typeIconMap.get(state.type ?? "")
);

watch(
    () => props.visible?.value,
    val => {
        if (val) state.zIndex = nextZIndex();
        if (props.boxType !== 'prompt') return
        if (!val) return
        nextTick(() => {
            // 聚焦
            inputRef.value && inputRef.value.focus()
        })
    }
)

// 点击遮罩层关闭 MessageBox
function handleWrapperClick() {
    props.closeOnClickModal && handleAction("close");
}

// 按下回车键确认提交 input 内容
function handleInputEnter(e: KeyboardEvent) {
    if (state.inputType === "textarea") return;
    e.preventDefault();
    return handleAction("confirm");
}

function handleAction(action: MessageBoxAction) {
    //关闭前的回调函数
    isFunction(props.beforeClose)
        ? props.beforeClose(action, state, () => doAction(action, state.inputValue))
        : doAction(action, state.inputValue);
}

function handleClose() {
    handleAction("close");
}
</script>

<template>
    <transition name="fade-in-linear" @after-leave="destroy">
        <hs-overlay v-show="(visible as Ref).value" :z-index="state.zIndex" mask>
            <div role="dialog" class="er-overlay-message-box" @click="handleWrapperClick">
                <!-- @click.stop 阻止内部元素的点击事件冒泡关闭 messagebox -->
                <div 
                    ref="rootRef" 
                    :class="['er-message-box', {'is-center': state.center}]" 
                    @click.stop
                >
                    <div v-if="!isNil(state.title)" ref="headerRef" class="er-message-box__header"
                        :class="{ 'show-close': state.showClose }">
                        <div class="er-message-box__title">
                            <hs-icon v-if="iconComponent && state.center" :class="{
                                [`er-icon-${state.type}`]: state.type,
                            }" :icon="iconComponent" />
                            {{ state.title }}
                        </div>
                        <button v-if="showClose" class="er-message-box__header-btn" @click.stop="handleClose">
                            <hs-icon icon="xmark" />
                        </button>
                    </div>
                    <div class="er-message-box__content">
                        <hs-icon v-if="iconComponent && !state.center && hasMessage" :class="{
                            [`er-icon-${state.type}`]: state.type,
                        }" :icon="iconComponent" />
                        <div v-if="hasMessage" class="er-message-box__message">
                            <slot>
                                <component :is="state.showInput ? 'label' : 'p'"
                                    :for="state.showInput ? inputId : void 0">
                                    {{ state.message }}
                                </component>
                            </slot>
                        </div>
                    </div>
                    <div v-show="state.showInput" class="er-message-box__input">
                        <hs-input v-model="state.inputValue" ref="inputRef" :placeholder="state.inputPlaceholder"
                            :type="state.inputType" @keyup.enter="handleInputEnter" />
                    </div>
                    <div class="er-message-box__footer">
                        <hs-button v-if="state.showCancelButton"
                            class="er-message-box__footer-btn er-message-box__cancel-btn" :type="state.cancelButtonType"
                            :round="state.roundButton" :loading="state.cancelButtonLoading"
                            @click="handleAction('cancel')" @keydown.prevent.enter="handleAction('cancel')">{{
                            state.cancelButtonText }}</hs-button>
                        <hs-button v-show="state.showConfirmButton"
                            class="er-message-box__footer-btn er-message-box__confirm-btn"
                            :type="state.confirmButtonType ?? 'primary'" :round="state.roundButton"
                            :loading="state.confirmButtonLoading" @click="handleAction('confirm')"
                            @keydown.prevent.enter="handleAction('confirm')">{{ state.confirmButtonText }}</hs-button>
                    </div>
                </div>
            </div>
        </hs-overlay>
    </transition>
</template>

<style>
@import './style.css';
</style>