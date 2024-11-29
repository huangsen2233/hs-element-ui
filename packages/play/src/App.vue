<script setup lang="ts">
import { ref } from "vue"
import { HsMessage } from 'hs-element-ui'

const activeNames = ref(['1', '2'])

const dropdownItem = [
  { command: 1, label:'下拉a', disabled: false },
  { command: 2, label:'下拉b', disabled: false },
  { command: 3, label:'下拉c', disabled: true },
  { command: 4, label:'下拉d', disabled: true },
]

function onSuccessMsg() {
  HsMessage.success('成功消息')
}

function onErrorMsg() {
  HsMessage.error('失败消息')
}

function onWarningMsg() {
  HsMessage({
    showClose: true,
    message: '警告消息',
    type: 'warning',
  })
}
</script>

<template>
  <hs-button
    type="primary"
    size="small"
    :loading="true"
    icon="search"
  >
    按钮aaa
  </hs-button>

  <hs-button-group type="primary" size="large">
    <hs-button icon="search">
      按钮组-1
    </hs-button>
    <hs-button icon="user">
      按钮组-2
    </hs-button>
  </hs-button-group>

  <div style="width: 300px;">
    <!-- accordion 手风琴模式 -->
    <hs-collapse  v-model="activeNames"> 
      <hs-collapse-item name="1" title="标题1">内容111111</hs-collapse-item>
      <hs-collapse-item name="2" title="标题2">内容222222</hs-collapse-item>
    </hs-collapse>
  </div>

  <hs-alert type="success" center>警告组件</hs-alert>

  <hs-tooltip content="tooltip content info" trigger="click">
    <div style="background: #ddd; padding:5px;">点击弹出提示</div>
  </hs-tooltip>

  <hs-popconfirm title="are you sure delete?">
    <span>删除</span>
  </hs-popconfirm>  

  <hs-dropdown :items="dropdownItem" disabled>
    dropdown list
  </hs-dropdown>

  <hs-dropdown :items="dropdownItem">
    dropdown list
  </hs-dropdown>

  <hs-button @click="onSuccessMsg">成功消息</hs-button>
  <hs-button @click="onErrorMsg">失败消息</hs-button>
  <hs-button @click="onWarningMsg">警告消息</hs-button>
</template>

<style scoped>

</style>
