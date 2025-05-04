<script setup>
import { HsMessage } from "hs-element-plus";
function handleBtnClick() {
  HsMessage.info("btn click");
}
</script>

<template>
  <p>
    <hs-button @click="handleBtnClick"> with throttle</hs-button>
    <hs-button :use-throttle="false" @click="handleBtnClick"
      >without throttle</hs-button
    >
  </p>
</template>
