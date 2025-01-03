<script setup lang="ts">
import { ref, reactive } from "vue"
import { HsMessage, HsNotification, HsMessageBox } from 'hs-element-ui'
import ErButton from "./components/Button/Button.vue"

const activeNames = ref(['1', '2'])

const form = reactive({
  name: 'hs',
  age: 26,
  hobby: 'code'
})

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

function onSuccNot() {
  HsNotification.success({
    title: '成功通知',
    message: '这是一条成功的消息',
    position: 'top-right',
  })
}

function onWarningNot() {
  HsNotification({
    title: '警告通知',
    message: '这是一条警告的消息',
    position: 'bottom-left',
  })
}

function openConfirm() {
  HsMessageBox.confirm('这是一条消息提示', '标题名称', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then((action: string) => {
    console.log("确定", action)
  }).catch((action: string) => {
    console.log("取消", action)
  })
}
</script>

<template>
  <er-button type="danger" size="large">er按钮</er-button>
  <hs-button
    type="primary"
    size="small"
    :loading="true"
    icon="search"
  >
    按钮aaa
  </hs-button>

  <hs-button
    type="primary"
    size="small"
    tag="div"
  >
    自定义标签-按钮
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

  <hs-button @click="onSuccNot">成功通知</hs-button>
  <hs-button @click="onWarningNot">警告通知</hs-button>

  <hs-input v-model="form.name" style="width: 200px;" />
  <hs-input v-model="form.age" :showPassword="true" type="password"/>
  <hs-input v-model="form.hobby" type="textarea"></hs-input>

  <hs-button @click="openConfirm" plain>消息盒子弹框</hs-button>
</template>

<style scoped>

</style>
