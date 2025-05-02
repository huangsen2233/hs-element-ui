<script lang="ts" setup>
import { ref } from "vue";

const disabled = ref(false);
</script>

<template>
  <hs-tooltip
    :disabled="disabled"
    content="click to close tooltip function"
    placement="bottom"
  >
    <hs-button @click="disabled = !disabled"
      >click to {{ disabled ? "active" : "close" }} tooltip function</hs-button
    >
  </hs-tooltip>
</template>
