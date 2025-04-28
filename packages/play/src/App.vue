<script setup lang="ts">
import { ref, computed } from "vue";
import HsComponents from "./HsComponents.vue"
import ErButton from "./components/Button/Button.vue"
import ErAlert from "./components/Alert/Alert.vue"
import ErTooltip from "./components/Tooltip/Tooltip.vue";
import HsPopconfirm from "./components/Popconfirm/Popconfirm.vue";
import HsDropdown from "./components/Dropdown/Dropdown.vue";
import DropdownItem from "./components/Dropdown/DropdownItem.vue";
import HsInput from './components/Input/Input.vue';
import message from "./components/Message/methods";
import MessageBox from "./components/MessageBox/methods";
import { HsSwitch } from 'hs-element-ui';
// import { HsLoading } from "hs-element-ui"
import { HsLoading } from "./components/Loading"
// import { HsSelect, HsOption } from "hs-element-ui";
import HsSelect from "./components/Select/Select.vue";
import HsOption from "./components/Select/Option.vue";

const props = defineProps()

const virtualRef = ref<HTMLElement>()
const inputValue = ref<string>("")

const handleMsgClick = () => {
  message.error("这是一条失败的消息")
}

const handleMsgBoxClick = () => {
  MessageBox.confirm("这是一条警告消息", "提示", {
    type: "warning",
    showCancelButton: true,
  }).then(() => {
    message.success("成功")
  }).catch(() => {
    message.info("取消")
  })
}

const handleServiceLoadingClick = () => {
  const instance = HsLoading.service({
    lock: true,
    text: "加载中...",
    spinner: "circle-notch",
    background: "rgba(0, 0, 0, 0.7)",
  })
  setTimeout(() => {
    // instance.close()
  }, 2000)
}

const loading = ref(false)

const handleDirectiveLoadingClick = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 2000)
}

const checked = ref(0)
const selectValue = ref('guangzhou')
const options = [
  { label: "beijing", value: "beijing" },
  { label: "shanghai", value: "shanghai" },
  { label: "guangzhou", value: "guangzhou" },
  { label: 'shenzhen', value: 'shenzhen', disabled: true },
]
</script>

<template>
  <!-- <hs-components>
    <template #header>组件插入头部列表</template>
    <template #default>
      <er-button type="success" size="large" icon='search'>成功按钮</er-button>
      <div>默认插入内容1</div>
      <div>默认插入内容22</div>
      <div>默认插入内容333</div>
    </template>
    <template #footer>组件插入尾部列表底部</template>
  </hs-components> -->
  <br />

  <er-button type="success" size="large" icon='search'>成功按钮</er-button>
  <er-alert  type="success" title="成功提示">成功类型的alert组件!</er-alert>
  <div ref="virtualRef">虚拟触发节点</div>
  <er-tooltip
    content="tooltip的提示内容"
    :virtualRef="virtualRef"
    :virtualTriggering="true"
    trigger="click"
  >
    tooltip文本
  </er-tooltip>

  <hs-popconfirm title="确定删除吗">
    <er-button type="primary">确认框</er-button>
  </hs-popconfirm>

  <hs-dropdown>
    <er-button type="primary">下拉菜单</er-button>
    <template v-slot:dropdown>
      <dropdown-item label='a'  />
      <dropdown-item label='b'  />
    </template>
  </hs-dropdown>

  <br />
  <div :style="{ width: '300px' }">
    <hs-input type="password" showPassword v-model="inputValue" placeholder="请输入"  />
  </div>

  <er-button type="danger" @click="handleMsgClick">失败消息按钮</er-button>

  <er-button type="warning" @click="handleMsgBoxClick">警告消息弹框按钮</er-button>

  <er-button type="primary" @click="handleServiceLoadingClick">service loading</er-button>

  <er-button 
    type="primary"
    v-loading.fullscreen.lock="loading"
    @click="handleDirectiveLoadingClick"
  >directive loading</er-button>

  <hs-switch v-model="checked" :active-value="1" :inactive-value="0" />
  {{ checked }}


  <!-- <hs-select v-model="selectValue" :options="options" clearable filterable /> -->
  <hs-select v-model="selectValue" filterable clearable>
    <hs-option value="beijing" label="北京"></hs-option>
    <hs-option value="shanghai" label="上海"></hs-option>
    <hs-option value="guangzhou" label="广州"></hs-option>
    <hs-option value="shenzhen" label="深圳" disabled></hs-option>
  </hs-select>


</template>

<style scoped>

</style>
