<script setup lang="ts">
import {
  computed, onMounted, watch,
  nextTick, reactive, ref,
  type VNode, provide, h,
} from 'vue';
import type {
  SelectOptionProps, SelectProps, SelectEmits,
  SelectContext, SelectStates, SelectInstance,
} from './types';
import type { TooltipInstance } from '../Tooltip/types';
import type { InputInstance } from '../Input/types';
import { POPPER_OPTIONS, SELECT_CTX_KEY } from './constants';
import HsTooltip from '../Tooltip/Tooltip.vue';
import HsInput from '../Input/Input.vue';
import HsIcon from '../Icon/Icon.vue';
import HsOption from './Option.vue';
import { useFocusController, useId, useClickOutside } from '@hs-element-ui/hooks';
import { debugWarn, RenderVnode } from '@hs-element-ui/utils';
import {
  find, filter, eq,
  size, each, get,
  noop, isFunction, map,
  isNil, assign, isBoolean,
  includes, debounce,
} from 'lodash-es';
import useKeyMap from './useKeyMap';

const COMPONENT_NAME = 'HsSelect';

defineOptions({
  name: COMPONENT_NAME,
});

const props = withDefaults(defineProps<SelectProps>(), {
  options: () => ([]),
});
const emits = defineEmits<SelectEmits>();
const slots = defineSlots()

const selectRef = ref<HTMLElement>();
const tooltipRef = ref<TooltipInstance>();
const inputRef = ref<InputInstance>();

// 通过 slot 插槽传入的 options
const filteredChilds = ref<Map<VNode, SelectOptionProps>>(new Map());
// 通过 props 传入的 options
const filteredOptions = ref(props.options ?? []);

// tooltip 下拉框的显示隐藏
const isDropdownVisible = ref(false);

// eq() 判断是否是相同的值; size() 返回传入参数的数量
// children 默认插槽 default slot 函数返回的数组
const children = computed(() => filter(slots?.default?.(), (child) => eq(child.type, HsOption)));
const hasChildren = computed(() => size(children.value) > 0);

const initialOptions = findOption(props.modelValue);

const selectStates = reactive<SelectStates>({
  inputValue: initialOptions?.label ?? '', // 选中 option 的 label 值
  selectedOption: initialOptions, // 选中 option 的对象
  mouseHover: false, // 鼠标是否在 select 组件上
  loading: false,
  highlightedIndex: -1, // 高亮的 option 的索引
});

const isDisabled = computed(() => props.disabled);

const showClear = computed(() => props.clearable && selectStates.mouseHover && selectStates.inputValue !== '');

// 当前选中的 option
const highlightedLine = computed(() => {
  let result: SelectOptionProps | void;
  if (hasChildren.value) {
    const node = [...filteredChilds.value][selectStates.highlightedIndex]?.[0];
    result = filteredChilds.value.get(node);
  } else {
    result = filteredOptions.value[selectStates.highlightedIndex];
  }
  return result;
})

// 处理 slot 传入的 options
const childrenOptions = computed(() => {
  if(!hasChildren.value) return [];
  return map(children.value, (item) => ({
    vNode: h(item),
    props: assign(item.props, {
      disabled: item.props?.disabled === true || (!isNil(item.props?.disabled)) && !isBoolean(item.props?.disabled),
    })
  }))
});

const isNoData = computed(() => {
  if (!props.filterable) return false;
  if (!hasData.value) return true;
  return false
})

// 是否是否有 options 数据
const hasData = computed(() => (
  (hasChildren.value && filteredChilds.value.size > 0) || (!hasChildren.value && size(filteredOptions.value) > 0)
));

//  options 中最后的索引
const lastIndex = computed(() =>
  hasChildren.value ? filteredChilds.value.size - 1 : size(filteredOptions.value) - 1
);

const filterPlaceholder = computed(() =>
  props.filterable && selectStates.selectedOption && isDropdownVisible.value
  ? selectStates.selectedOption.label
  : props.placeholder
);

const timeout = computed(() => props.remote ? 300 : 100);

const handleFilterDebounce = debounce(handleFilter, timeout.value)

const inputId = useId().value;
const {
  wrapperRef: inputWrapperRef,
  isFocused,
  handleFocus,
  handleBlur,
} = useFocusController(inputRef)

const keyMap = useKeyMap({
  isDropdownVisible,
  controlVisible,
  selectStates,
  highlightedLine,
  handleSelect,
  hasData,
  lastIndex,
});

useClickOutside(selectRef, (e) => handleClickOutside(e))

const fouce: SelectInstance['focus'] = function () {
  inputRef.value?.focus();
};
const blur: SelectInstance['blur'] = function () {
  handleClickOutside();
};

function handleClickOutside(e?: Event) {
  if (isFocused.value) {
    nextTick(() => handleBlur(new FocusEvent('blur', e)));
  }
}

// 控制 tooltip 下拉框显示隐藏
function controlVisible(visible: boolean) {
  if (!tooltipRef.value) return;
  get(tooltipRef, ["value", visible ? "show" : "hide"])?.();
  props.filterable && controlInputVal(visible);
  isDropdownVisible.value = visible;
  emits("visible-change", visible);
  selectStates.highlightedIndex = -1;
}

// 控制输入框的值
function controlInputVal(visible: boolean) {
  if (!props.filterable) return;
  if (visible) {
    if (selectStates.selectedOption) {
      selectStates.inputValue = '';
    }
    handleFilterDebounce();
  } else {
    selectStates.inputValue = selectStates.selectedOption?.label ?? '';
  }
}

function toggleVisible() {
  if (isDisabled.value) return;
  controlVisible(!isDropdownVisible.value)
}

function handleClear() {
  inputRef.value?.clear();
  selectStates.inputValue = '';
  selectStates.selectedOption = null;
  emits('clear');
  each(['change', 'update:modelValue'], (k) => emits(k as any, ''));
  // formitem clear逻辑暂不写
}

function findOption(value: string): SelectOptionProps | void {
  if (hasChildren.value) {
    return find([...filteredChilds.value.values()], (option) => option.value === value);
  } else {
    return find(filteredOptions.value, (option) => option.value === value);
  }
}

function handleSelect(opt: SelectOptionProps) {
  if (opt.disabled) return;
  selectStates.selectedOption = opt;
  selectStates.inputValue = opt.label;
  each(['change', 'update:modelValue'], (k) => emits(k as any, opt.value));
  controlVisible(false);
  inputRef.value?.focus();
}

// 重置 slot 传入的 options
function setFilteredChilds(opts: typeof childrenOptions.value) {
  filteredChilds.value.clear();
  each(opts, (item) => {
    const { vNode, props } = item;
    filteredChilds.value.set(vNode, props as SelectOptionProps);
  });
}

// filterable 搜索功能
function handleFilter() {
  const searchKey = selectStates.inputValue;
  selectStates.highlightedIndex = -1;
  if (hasChildren.value) {
    genFilterChilds(searchKey);
  } else {
    genFilterOptions(searchKey);
  }
}

// options 的键盘事件
function handleKeyDown(e: KeyboardEvent) {
  keyMap.has(e.key) && keyMap.get(e.key)?.(e);
}

// 搜索 slot 传入的 options
async function genFilterChilds(search: string) {
  if (!props.filterable) return;
  if (props.remote && props.remoteMethod && isFunction(props.remoteMethod)) {
    // remote search
    await callRemoteMethod(props.remoteMethod, search);
    setFilteredChilds(childrenOptions.value);
    return
  }
  if (props.filterMethod && isFunction(props.filterMethod)) {
    // filter search
    const opts = map(props.filterMethod(search), 'value')
    setFilteredChilds(
      filter(childrenOptions.value, item => includes(opts, item.props.value))
    );
    return
  }
  // defalut search
  setFilteredChilds(
    filter(childrenOptions.value, item => includes(item.props.label, search))
  );
}
// 搜索并重置 props 传入的 options
async function genFilterOptions(search: string) {
  if (!props.filterable) return;
  if (props.remote && props.remoteMethod && isFunction(props.remoteMethod)) {
    // remote search
    filteredOptions.value = await callRemoteMethod(props.remoteMethod, search);
    return
  }
  if (props.filterMethod && isFunction(props.filterMethod)) {
    // filter search
    filteredOptions.value = props.filterMethod(search);
    return
  }
  // defalut search
  filteredOptions.value = filter(props.options, (opt) => includes(opt.label, search));
}

// 远程搜索 options
async function callRemoteMethod(method: Function, search: string) {
  if (!method || !isFunction(method)) return;
  selectStates.loading = true;
  let result;
  try {
    result = await method(search);
  } catch (error) {
    debugWarn(error as Error)
    debugWarn(COMPONENT_NAME, 'callRemoteMethod error')
    result = []
    return Promise.reject(error);
  } finally {
    selectStates.loading = false;
  }
  return result;
}

function renderLabel(opt: SelectOptionProps): VNode | string {
  if (isFunction(props.renderLabel)) {
    return props.renderLabel(opt);
  }
  return opt.label;
}

function setSelected() {
  const opt = findOption(props.modelValue);
  if (!opt) return;
  selectStates.selectedOption = opt;
  selectStates.inputValue = opt.label;
}

watch(() => props.options, (newVal) => {
  filteredOptions.value = newVal ?? [];
})

watch(
  () => childrenOptions.value,
  (newVal) => {
    setFilteredChilds(newVal);
  },
  { immediate: true },
)

watch(
  () => props.modelValue,
  () => {
    // 表单校验逻辑暂时不写
    setSelected()
  },
)

onMounted(() => {
  setSelected()
});

provide<SelectContext>(SELECT_CTX_KEY, {
  handleSelect,
  selectStates,
  renderLabel,
  highlightedLine,
});

defineExpose({
  fouce,
  blur,
});
</script>

<template>
  <div
    ref="selectRef"
    class="er-select"
    :class="{
      'is-disabled': isDisabled,
    }"
    @click.stop="toggleVisible"
    @mouseenter="selectStates.mouseHover = true"
    @mouseleave="selectStates.mouseHover = false"
  >
    <hs-tooltip
      ref="tooltipRef"
      placement="bottom-start"
      :popper-options="POPPER_OPTIONS"
      @click-outside="controlVisible(false)"
      manual
    >
      <template #default>
        <div ref="inputWrapperRef">
          <hs-input
            ref="inputRef"
            v-model="selectStates.inputValue"
            :id="inputId"
            :disabled="isDisabled"
            :placeholder="filterable ? filterPlaceholder : placeholder"
            :readonly="!filterable || !isDropdownVisible"
            @focus="handleFocus"
            @blur="handleBlur"
            @input="handleFilterDebounce"
            @keydown="handleKeyDown"
          >
            <template #suffix>
              <hs-icon
                v-if="showClear"
                icon="circle-xmark"
                class="er-input__clear"
                @click.stop="handleClear"
                @mousedown.prevent="noop"
              />
              <hs-icon
                v-else
                class="header-angle"
                icon="angle-down"
                :class="{ 'is-active': isDropdownVisible }"
              />
            </template>
          </hs-input>
        </div>
      </template>
      <template #content>
        <div class="er-select__loading" v-if="selectStates.loading">
          <hs-icon icon="spinner" spin />
        </div>
        <div class="er-select__nodata" v-else-if="filterable && isNoData">
          No Data
        </div>
        <ul class="er-select__menu">
          <!-- 通过 props 传入的 options -->
          <template v-if="!hasChildren">
            <hs-option
              v-for="item in filteredOptions"
              :key="item.value"
              v-bind="item"
            />
          </template>
          <!-- 通过 slot 传入的 options -->
          <template v-else>
            <template
              v-for="[vNode, _props] in filteredChilds"
              :key="_props.value"
            >
              <render-vnode :vNode="vNode" />
            </template>
          </template>
        </ul>
      </template>
    </hs-tooltip>
  </div>
</template>

<style>
@import './style.css';
</style>