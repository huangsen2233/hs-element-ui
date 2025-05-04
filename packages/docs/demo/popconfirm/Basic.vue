<script setup lang="ts">
import { ja, ko, en, zhCn, zhTw, HsConfigProvider } from "hs-element-plus";
import { get } from "lodash-es";

import { computed, ref } from "vue";

const language = ref("");
const langMap = {
  ja,
  ko,
  en,
  zhCn,
  zhTw,
} as const;
const locale = computed(() => get(langMap, language.value));
const changelang = () => {
  const l = ["zhCn", "zhTw", "ko", "en", "ja"];
  language.value = l[(l.indexOf(language.value) + 1) % l.length];
};
</script>
<template>
  <hs-button @click="changelang" type="info" style="margin-right: 20px"
    >change language</hs-button
  >
  <hs-config-provider :locale="locale">
    <hs-popconfirm title="Are you shure to delete this item?">
      <hs-button>Delete</hs-button>
    </hs-popconfirm>
  </hs-config-provider>
</template>
