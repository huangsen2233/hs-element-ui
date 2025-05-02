<script lang="ts" setup>
import { reactive, ref } from "vue";
import { HsMessage, type FormInstance } from "hs-element-ui";

const formRef = ref<FormInstance>();
const form = reactive({
  name: "",
  region: "",
  delivery: false,
  desc: "",
});

const options = ref([
  { value: "beijing", label: "Zone One" },
  { value: "shanghai", label: "Zone Two" },
]);

const rules = reactive({
  name: [
    { required: true, message: "请输入活动名称", trigger: "blur" },
    { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
  ],
  region: [{ required: true, message: "请选择活动区域", trigger: "change" }],
  desc: [{ required: true, message: "请填写活动形式", trigger: "blur" }],
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
</script>

<template>
  <hs-form ref="formRef" :model="form" :rules="rules">
    <hs-form-item label="Activity name" prop="name">
      <hs-input v-model="form.name" />
    </hs-form-item>
    <hs-form-item label="Activity zone" prop="region">
      <hs-select
        v-model="form.region"
        placeholder="please select your zone"
        :options="options"
      />
    </hs-form-item>
    <hs-form-item label="Instant delivery" prop="delivery">
      <hs-switch v-model="form.delivery" />
    </hs-form-item>
    <hs-form-item label="Activity form" prop="desc">
      <hs-input v-model="form.desc" type="textarea" />
    </hs-form-item>
    <hs-form-item>
      <hs-button type="primary" @click="onSubmit">Create</hs-button>
      <hs-button @click="onReset">Reset</hs-button>
    </hs-form-item>
  </hs-form>
</template>
