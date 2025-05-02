<script setup lang="ts">
import { HsMessageBox, HsMessage } from "hs-element-ui";

function openAlert() {
  HsMessageBox.alert("This is a message", "Title")
    .then((action) => {
      HsMessage.info(`action: ${action}`);
    })
    .catch((action) => {
      HsMessage.warning(`action: ${action}`);
    });
}
</script>

<template>
  <hs-button @click="openAlert" plain> Click to open the Alert</hs-button>
</template>
