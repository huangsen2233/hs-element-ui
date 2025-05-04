<script setup>
import { HsMessage } from "hs-element-plus";

function handleClose() {
  HsMessage.info("close callback");
}
</script>
<template>
  <div class="basic block">
    <hs-alert title="Unclosable alert" type="success" :closable="false" />
    <hs-alert title="Alert with callback" type="warning" @close="handleClose" />
  </div>
</template>
