<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import type { SwitchProps, SwitchEmits, SwitchInstance } from './types';
import { useId } from '@hs-element-ui/hooks';

defineOptions({
  name: 'HsSwitch',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<SwitchProps>(), {
  activeValue: true,
  inactiveValue: false,
});

const emit = defineEmits<SwitchEmits>();

const isDisabled = computed(() => props.disabled);
const innerValue = ref(props.modelValue);
const inputRef = ref<HTMLInputElement>();
const inputId = useId().value;
const checked = computed(() => {
  return innerValue.value === props.activeValue;
});

const focus: SwitchInstance['focus'] = function() {
  inputRef.value?.focus();
};

function handleChange() {
  if (isDisabled.value) return;
  const newValue = checked.value ? props.inactiveValue : props.activeValue;
  innerValue.value = newValue;
  emit('update:modelValue', newValue);
  emit('change', newValue);
};

onMounted(() => {
  inputRef.value!.checked = checked.value;
});

watch(checked, (newVal) => {
  if (inputRef.value) {
    inputRef.value!.checked = newVal;
  }
  // form 校验后续补充
});

defineExpose<SwitchInstance>({
  focus,
  checked,
});
</script>

<template>
  <div
    class="er-switch"
    :class="{
      [`er-switch--${size}`]: size,
      'is-disabled': isDisabled,
      'is-checked': checked,
    }"
    @click="handleChange"
  >
    <input
      class="er-switch__input"
      type="checkbox"
      role="switch"
      ref="inputRef"
      :id="inputId"
      :name="name"
      :disabled="isDisabled"
      :checked="checked"
      @keydown.enter="handleChange"
    />
    <div class="er-switch__core">
      <div class="er-switch__core-inner">
        <span
          v-if="activeText || inactiveText"
          class="er-switch__core-inner-text"
        >
          {{ checked ? activeText : inactiveText }}
        </span>
      </div>
      <div class="er-switch__core-action"></div>
    </div>
  </div>
</template>

<style>
@import './style.css';
</style>