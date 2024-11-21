<script setup lang="ts">
import { ref } from "vue"

const activeNames = ref(['1', '2'])
</script>

<template>
  <hs-button
    type="primary"
    size="small"
    :loading="true"
    icon="search"
  >
    按钮aaa
  </hs-button>

  <hs-button-group type="primary" size="large">
    <hs-button icon="search">
      按钮组-1
    </hs-button>
    <hs-button icon="user">
      按钮组-2
    </hs-button>
  </hs-button-group>

  <div style="width: 300px;">
    <!-- accordion 手风琴模式 -->
    <hs-collapse  v-model="activeNames"> 
      <hs-collapse-item name="1" title="标题1">内容111111</hs-collapse-item>
      <hs-collapse-item name="2" title="标题2">内容222222</hs-collapse-item>
    </hs-collapse>
  </div>

  <hs-alert type="success" center>警告组件</hs-alert>
</template>

<style scoped>

</style>
