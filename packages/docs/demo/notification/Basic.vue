<script setup lang="ts">
import { h } from "vue";
import { HsNotification } from "hs-element-plus";

function openNotify1() {
  HsNotification({
    title: "Title",
    message: h("i", { style: "color:teal" }, "This is a remider"),
    position:'bottom-right'
  });
}

function openNotify2() {
  HsNotification({
    title: "Prompt",
    message: "This is a message that does not auto close",
    duration: 0,
    position:'top-left'
  });
}
</script>

<template>
  <hs-button @click="openNotify1" plain>Closes automatically</hs-button>
  <hs-button @click="openNotify2" plain>Won't closes automatically</hs-button>
</template>
