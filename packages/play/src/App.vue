<script setup lang="ts">
import { ref, computed, reactive, onMounted } from "vue";
import {
  HsMessage,
  type FormInstance,
  HsLoading,
  HsMessageBox as MessageBox,
  HsConfigProvider, ja, ko, en, zhCn, zhTw,
} from "hs-element-plus";
import { ErTooltip } from "./Child/Tooltip"
import { ErPopconfirm } from "./components/Popconfirm"
import { ErDropdown, ErDropdownItem } from "./components/Dropdown"
import { ErConfigProvider } from "./components/ConfigProvider"

const virtualRef = ref<HTMLElement>()
const inputValue = ref<string>("")

const handleMsgClick = () => {
  HsMessage.error("这是一条失败的消息")
}

const handleMsgBoxClick = () => {
  MessageBox.confirm("这是一条警告消息", "提示", {
    type: "warning",
    showCancelButton: true,
  }).then(() => {
    HsMessage.success("成功")
  }).catch(() => {
    HsMessage.info("取消")
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
    instance.close()
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

const formRef = ref<FormInstance>();
const model = reactive({
  name: "",
  desc: "",
});

const rules = reactive({
  name: [
    { required: true, message: "请输入活动名称", trigger: "blur" },
    { min: 3, max: 6, message: 'Length should be 3 to 5', trigger: ['blur', 'change'] },
  ],
  desc: [
    { required: true, message: "请填写活动形式", trigger: "blur" }
  ],
});

const onSubmit = () => {
  formRef.value?.validate().then((valid) => {
    if (valid) {
      HsMessage.success("submit!");
    }
  });
};

const onReset = () => {
  formRef.value?.resetFields();
};

const activeNames = ref(['1'])

const dropdownItem = [
  { command: 'a', label: '1', disabled: true },
  { command: 'b', label: '22', divided: true },
  { command: 'c', label: '333' },
]

const language = ref("ko");
const langMap = {
  ja,
  ko,
  en,
  zhCn,
  zhTw,
};
const locale = computed(() => langMap[language.value]);
const changelang = () => {
  const list = ["zhCn", "zhTw", "ko", "en", "ja"];
  const index = Math.floor(Math.random() * list.length);
  console.log('index', index);
  language.value = list[index];
};
</script>

<template>
  <hs-button type="primary" @click="changelang">切换语言</hs-button>
  <!-- <er-config-provider :locale="locale"> -->
    <hs-popconfirm title="确定删除吗">
      <template v-slot:reference>
        <hs-button type="primary">气泡弹框</hs-button>
      </template>
    </hs-popconfirm>
  <!-- </er-config-provider> -->

  <hs-button type="success" size="large" icon='search'>成功按钮</hs-button>

  <hs-alert  type="success" title="成功提示">成功类型的alert组件!</hs-alert>

  <hs-collapse accordion v-model="activeNames">
    <hs-collapse-item name="1" title="标题1">内容111111</hs-collapse-item>
    <hs-collapse-item name="2" title="标题2">内容222222</hs-collapse-item>
  </hs-collapse>

  <div ref="virtualRef">虚拟触发节点</div>
  <er-tooltip
    content="tooltip的提示内容"
    trigger="click"
  >
    tooltip的默认文本
  </er-tooltip>

  <hs-popconfirm title="确定删除吗">
    <template v-slot:reference>
      <hs-button type="primary">reference 插槽确认框按钮</hs-button>
    </template>
  </hs-popconfirm>

  <er-dropdown>
    <hs-button type="primary">下拉菜单</hs-button>
    <template v-slot:dropdown>
      <er-dropdown-item label='a' disabled />
      <er-dropdown-item label='b'  />
    </template>
  </er-dropdown>

  <er-dropdown :items="dropdownItem">
    <span>items形式的下拉菜单</span>
  </er-dropdown>


  <er-dropdown :disabled="true">
    <span>
      禁用整个下拉菜单
      <hs-icon icon="angle-down"></hs-icon>
    </span>
    <template v-slot:dropdown>
      <er-dropdown-item label='a'  />
      <er-dropdown-item label='b'  />
    </template>
  </er-dropdown>

  <br />
  <div :style="{ width: '300px' }">
    <hs-input type="password" showPassword v-model="inputValue" placeholder="请输入"  />
  </div>

  <hs-button type="danger" @click="handleMsgClick">失败消息按钮</hs-button>

  <hs-button type="warning" @click="handleMsgBoxClick">警告消息弹框按钮</hs-button>

  <hs-button type="primary" @click="handleServiceLoadingClick">service loading</hs-button>

  <hs-button
    type="primary"
    v-loading.fullscreen.lock="loading"
    @click="handleDirectiveLoadingClick"
  >directive loading</hs-button>

  <hs-switch v-model="checked" :active-value="1" :inactive-value="0" />
  {{ checked }}


  <!-- <hs-select v-model="selectValue" :options="options" clearable filterable /> -->
  <hs-select v-model="selectValue" filterable clearable>
    <hs-option value="beijing" label="北京"></hs-option>
    <hs-option value="shanghai" label="上海"></hs-option>
    <hs-option value="guangzhou" label="广州"></hs-option>
    <hs-option value="shenzhen" label="深圳" disabled></hs-option>
  </hs-select>

  <hs-form ref="formRef" :model="model" :rules="rules" style="width: 500px">
    <hs-form-item label="Activity name" prop="name">
      <hs-input v-model="model.name" />
    </hs-form-item>
    <hs-form-item label="Activity form" prop="desc">
      <hs-input v-model="model.desc" type="textarea" />
    </hs-form-item>
    <hs-form-item>
      <hs-button type="primary" @click="onSubmit">Create</hs-button>
      <hs-button @click="onReset">Reset</hs-button>
    </hs-form-item>
  </hs-form>

</template>

<style>

</style>
