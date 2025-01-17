<script setup lang="ts">
import { ref } from "vue"
import HsComponents from "./HsComponents.vue"
import ErButton from "./components/Button/Button.vue"
import ErAlert from "./components/Alert/Alert.vue"
import { ErTooltip } from "./components/Tooltip";
import HsPopconfirm from "./components/Popconfirm/Popconfirm.vue";

</script>

<template>
  <er-button type="success" size="large" icon='search'>er按钮</er-button>
  <er-alert type="success" title="成功提示">成功类型的alert组件!</er-alert>

  <er-tooltip content="我是一个提示">tooltip文本</er-tooltip>

  <hs-popconfirm title="确定删除吗">
    <er-button type="primary">确认框</er-button>
  </hs-popconfirm>
</template>

<style scoped>

</style>
