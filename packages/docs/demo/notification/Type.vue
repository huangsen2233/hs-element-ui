<script lang="ts" setup>
import { HsNotification } from "hs-element-plus";

const open1 = () => {
  HsNotification({
    title: "Success",
    message: "This is a success message",
    type: "success",
  });
};

const open2 = () => {
  HsNotification({
    title: "Warning",
    message: "This is a warning message",
    type: "warning",
  });
};

const open3 = () => {
  HsNotification({
    title: "Info",
    message: "This is an info message",
    type: "info",
  });
};

const open4 = () => {
  HsNotification({
    title: "Error",
    message: "This is an error message",
    type: "danger",
  });
};
</script>

<template>
  <hs-button plain @click="open1"> Success </hs-button>
  <hs-button plain @click="open2"> Warning </hs-button>
  <hs-button plain @click="open3"> Info </hs-button>
  <hs-button plain @click="open4"> Error </hs-button>
</template>
