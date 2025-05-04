<script lang="ts" setup>
import { HsMessage } from "hs-element-plus";

const open1 = () => {
  HsMessage({
    showClose: true,
    message: "This is a message.",
  });
};
const open2 = () => {
  HsMessage({
    showClose: true,
    message: "Congrats, this is a success message.",
    type: "success",
  });
};
const open3 = () => {
  HsMessage({
    showClose: true,
    message: "Warning, this is a warning message.",
    type: "warning",
  });
};
const open4 = () => {
  HsMessage({
    showClose: true,
    message: "Oops, this is a error message.",
    type: "danger",
  });
};
</script>

<template>
  <hs-button :plain="true" @click="open1">Message</hs-button>
  <hs-button :plain="true" @click="open2">Success</hs-button>
  <hs-button :plain="true" @click="open3">Warning</hs-button>
  <hs-button :plain="true" @click="open4">Error</hs-button>
</template>
