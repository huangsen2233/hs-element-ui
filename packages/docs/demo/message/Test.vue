<script lang="ts" setup>
import { HsMessage } from "hs-element-plus";

const open1 = () => {
  HsMessage({
    message: "Congrats, this is a success message.",
    type: "success",
  });
};
const open2 = () => {
  HsMessage.success("Congrats, this is a success message.");
};
</script>
<template>
  <div>
    <hs-button @click="open1">插件式调用</hs-button>
    <hs-button @click="open2">函数式调用</hs-button>
    <hs-button @click="$message.success('Congrats, this is a success message.')"
      >全局方法调用</hs-button
    >
  </div>
</template>
