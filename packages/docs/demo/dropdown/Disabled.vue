<script setup lang="ts">
import { type DropdownItemProps } from "hs-element-plus";

const items: DropdownItemProps[] = [
  { command: "1", label: "Action 1" },
  { command: "2", label: "Action 2" },
  { command: "3", label: "Action 3", disabled: true },
  { command: "4", label: "Action 4", divided: true },
];
</script>

<template>
  <div class="row">
    <div class="col">
      <div class="desc">disabled</div>
      <hs-dropdown :items="items" disabled>
        <span class="dropdown-link">
          Dropdown List
          <hs-icon icon="angle-down" />
        </span>
      </hs-dropdown>
    </div>
    <div class="col">
      <div class="desc">undisabled</div>
      <hs-dropdown :items="items">
        <span class="dropdown-link">
          Dropdown List
          <hs-icon icon="angle-down" />
        </span>
      </hs-dropdown>
    </div>
  </div>
</template>

<style scoped>
.row {
  display: flex;
  flex-wrap: wrap;
}
.col {
  flex: 1;
}
.desc {
  display: block;
  color: var(--er-text-color-secondary);
  font-size: 14px;
  margin-bottom: 20px;
}
.dropdown-link {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: var(--er-color-primary);
  i {
    margin-left: 8px;
  }
}
</style>
