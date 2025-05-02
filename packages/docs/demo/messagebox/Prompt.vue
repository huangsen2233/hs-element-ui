<script setup lang="ts">
import { HsMessageBox, HsMessage } from "hs-element-ui";

function openConfirm() {
  HsMessageBox.prompt("Place input your name", "Tip", { type: "info" })
    .then(({ value }) => {
      HsMessage.info(`your name is: ${value}`);
    })
    .catch((action) => {
      HsMessage.warning(`action: ${action}`);
    });
}
</script>

<template>
  <hs-button @click="openConfirm" plain> Click to open the Confirm</hs-button>
</template>
