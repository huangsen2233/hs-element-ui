<script lang="ts" setup>
import { HsMessage } from "hs-element-plus";

const openCenter = () => {
  HsMessage({
    showClose: true,
    message: "Centered text",
    center: true
  });
};
</script>

<template>
  <hs-button plain @click="openCenter">Centered text</hs-button>
</template>
