<script setup lang="ts">
import { h } from "vue";
import { HsMessage, HsMessageBox } from "hs-element-plus";
import { delay } from "lodash-es";

async function openMsgBox() {
  try {
    const action = await HsMessageBox({
      title: "Message",
      message: h("p", null, [
        h("span", null, "Message can be "),
        h("i", { style: "color: teal" }, "VNode"),
      ]),
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      type: "danger",
      icon: "trash",
      beforeClose(action, instance, done) {
        if (action !== "confirm") {
          done();
          return;
        }

        instance.confirmButtonLoading = true;
        instance.confirmButtonText = "Loading...";
        delay(() => {
          done();
          delay(() => (instance.confirmButtonLoading = false), 1000);
        }, 3000);
      },
    });

    HsMessage.info(`action : ${action}`);
  } catch (action) {
    HsMessage.warning(`action : ${action}`);
  }
}
</script>

<template>
  <hs-button @click="openMsgBox" plain>Click to open Message Box</hs-button>
</template>
