<script setup lang="ts">
import { computed, type Ref } from 'vue';
import type { LoadingOptions } from './types';
import { isString } from 'lodash-es';
import HsIcon from '../Icon/Icon.vue';

defineOptions({
  name: 'HsLoading',
  inheritAttrs: false
});

const props = defineProps<LoadingOptions>();

const iconName = computed(() => {
  if (isString(props.spinner)) {
    return props.spinner;
  }
  return 'spinner'; // 雪花加载图标：spinner，圆圈加载图标：circle-notch
})
</script>

<template>
  <transition name="fade-in-linear" @after-leave="onAfterLeave">
    <div
      v-show="(props.visible as Ref).value"
      class="er-loading er-loading__mask"
      :class="{ 'is-fullscreen': fullscreen }"
    >
      <div class="er-loading__spinner">
        <hs-icon v-if="props.spinner !== false" :icon="iconName" spin />
        <p v-if="text" class="er-loading-text">{{ text }}</p>
      </div>
    </div>
  </transition>
</template>

<style>
/* 有全局滚动条的样式，所以不加 scoped */
@import './style.css';
.er-loading {
  --er-loading-bg-color: v-bind(background) !important;
  --er-loading-z-index: v-bind(zIndex) !important;
}
</style>