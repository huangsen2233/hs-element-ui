<script setup lang="ts">
import { h, ref } from "vue";
import { HsMessageBox, HsSwitch, type SwitchValueType } from "hs-element-plus";

function open1() {
  HsMessageBox({
    title: "Message",
    message: h("p", null, [
      h("span", null, "Message can be "),
      h("i", { style: "color: teal" }, "VNode"),
    ]),
  });
}

function open2() {
  const checked = ref<SwitchValueType>(false);
  HsMessageBox({
    title: "Message",
    message: () =>
      h(HsSwitch, {
        modelValue: checked.value,
        "onUpdate:modelValue": (val: SwitchValueType) => {
          checked.value = val;
        },
      }),
  });
}
</script>

<template>
  <hs-button @click="open1" plain>Common VNode</hs-button>
  <hs-button @click="open2" plain>Dynamic props</hs-button>
</template>
