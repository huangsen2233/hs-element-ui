<script setup lang="ts">
import { HsMessage, HsMessageBox } from "hs-element-ui";

function openMsgBox() {
  HsMessageBox.confirm(
    "proxy will permanently delete the file. Continue?",
    "Warning",
    {
      type: "warning",
      center: true,
      // 这里展示一下 不用 Promise 写法的时候
      callback(action) {
        if (action === "confirm") {
          HsMessage.info(action);
        } else {
          HsMessage.warning(action as string);
        }
      },
    }
  );
}
</script>

<template>
  <hs-button @click="openMsgBox" plain>Click to open Message Box</hs-button>
</template>
