<script setup lang="ts">
import { ref } from "vue"
import HsComponents from "./HsComponents.vue"
import ErButton from "./components/Button/Button.vue"
import ErAlert from "./components/Alert/Alert.vue"

</script>

<template>
  <er-button type="success" size="large" icon='search'>er按钮</er-button>
  <er-alert type="success" title="成功提示">成功类型的alert组件!</er-alert>
</template>

<style scoped>

</style>
