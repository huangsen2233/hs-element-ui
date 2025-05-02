<script setup lang="ts">
import { type DropdownItemProps, HsMessage } from "hs-element-ui";

const items: DropdownItemProps[] = [
  { command: "1", label: "Action 1" },
  { command: "2", label: "Action 2" },
  { command: "3", label: "Action 3", disabled: true },
  { command: "4", label: "Action 4", divided: true },
];

function handleClick() {
  HsMessage.info("button click");
}
</script>

<template>
  <div class="row">
    <hs-dropdown :items="items">
      <hs-button type="primary">
        Dropdown List
        <hs-icon icon="angle-down" style="margin-left: 8px" />
      </hs-button>
    </hs-dropdown>
    <hs-dropdown
      :items="items"
      type="primary"
      @click="handleClick"
      split-button
    >
      Dropdown List
    </hs-dropdown>
  </div>
</template>

<style scoped>
.row div {
  margin-right: 16px;
}
</style>
