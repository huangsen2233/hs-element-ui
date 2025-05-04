<script lang="ts" setup>
import { h } from "vue";
import { HsMessage } from "hs-element-plus";

const open = () => {
  HsMessage("This is a message.");
};

const openVn = () => {
  HsMessage({
    message: h("p", { style: "line-height: 1; font-size: 14px" }, [
      h("span", null, "Message can be "),
      h("i", { style: "color: teal" }, "VNode"),
    ]),
  });
};
</script>

<template>
  <hs-button :plain="true" @click="open">Show message</hs-button>
  <hs-button :plain="true" @click="openVn">VNode</hs-button>
</template>
