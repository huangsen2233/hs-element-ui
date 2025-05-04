<script lang="ts" setup>
import { reactive, ref } from "vue";
import { HsMessage } from "hs-element-plus";

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

const onSubmit = () => {
  HsMessage.success("submit!");
};
</script>

<template>
  <hs-form :model="form">
    <hs-form-item label="Activity name">
      <hs-input v-model="form.name" />
    </hs-form-item>
    <hs-form-item label="Activity zone">
      <hs-select
        v-model="form.region"
        placeholder="please select your zone"
        :options="options"
      />
    </hs-form-item>
    <hs-form-item label="Instant delivery">
      <hs-switch v-model="form.delivery" />
    </hs-form-item>
    <hs-form-item label="Activity form">
      <hs-input v-model="form.desc" type="textarea" />
    </hs-form-item>
    <hs-form-item>
      <hs-button type="primary" @click="onSubmit">Create</hs-button>
      <hs-button>Cancel</hs-button>
    </hs-form-item>
  </hs-form>
</template>
