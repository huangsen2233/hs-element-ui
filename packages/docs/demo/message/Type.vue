<script lang="ts" setup>
import { HsMessage } from "hs-element-ui";

const open1 = () => {
  HsMessage("This is a message.");
};
const open2 = () => {
  HsMessage({
    message: "Congrats, this is a success message.",
    type: "success",
  });
};
const open3 = () => {
  HsMessage({
    message: "Warning, this is a warning message.",
    type: "warning",
  });
};
const open4 = () => {
  HsMessage.error("Oops, this is a error message.");
};
</script>

<template>
  <hs-button :plain="true" @click="open2">Success</hs-button>
  <hs-button :plain="true" @click="open3">Warning</hs-button>
  <hs-button :plain="true" @click="open1">Message</hs-button>
  <hs-button :plain="true" @click="open4">Error</hs-button>
</template>
