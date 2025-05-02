<script lang="ts" setup>
import {HsNotification} from 'hs-element-ui'

const open = () => {
  HsNotification.success({
    title: 'Info',
    message: 'This is a message without close button',
    showClose: false,
  })
}
</script>

<template>
  <hs-button plain @click="open"> Hide close button </hs-button>
</template>