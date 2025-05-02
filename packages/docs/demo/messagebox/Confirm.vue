<script setup lang="ts">
import { HsMessageBox, HsMessage } from "hs-element-ui";

function openConfirm() {
  HsMessageBox.confirm("proxy will permanently delete the file. Continue?", "Warning", { type: "warning" })
    .then((action) => {
      HsMessage.info(`action: ${action}`);
    })
    .catch((action) => {
      HsMessage.warning(`action: ${action}`);
    });
}
</script>

<template>
  <hs-button @click="openConfirm" plain> Click to open the Confirm</hs-button>
</template>
