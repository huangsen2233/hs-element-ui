<script setup lang="ts">
import { provide, reactive, toRefs } from 'vue';
import type {
  FormProps, FormEmits, FormContext,
  FormItemContext, FormInstance,
} from './types';
import { FORM_CTX_KEY } from './constants';
import {
  size, filter, includes,
  each,
} from 'lodash-es';
import type { ValidateFieldsError } from 'async-validator';

defineOptions({
  name: 'HsForm',
});

const props = withDefaults(defineProps<FormProps>(), {
  showMessage: true,
  hideRequiredAsterisk: false,
  requiredAsteriskPosition: "left",
  labelPosition: "right",
});
const emits = defineEmits<FormEmits>();

// 表单字段
const fields: FormItemContext[] = [];

const validate: FormInstance['validate'] = (callback) => {
  return validateField([], callback)
}

// 过滤字段
function filterFields(fields: FormItemContext[], keys: string[]) {
  return size(keys) ? filter(fields, (field) => includes(keys, field.prop)) : fields;
}

// 校验过滤后的字段
const validateField: FormInstance['validateField'] = async function (keys, callback) {
  const filterArr = filterFields(fields, keys ?? []);
  try {
    const result = await doValidateField(filterArr);
    if (result === true) {
      callback?.(result);
    }
    return result;
  } catch (error) {
    if (error instanceof Error) throw error;
    const invalidFields = error as ValidateFieldsError;
    callback?.(false, invalidFields);
    return Promise.reject(invalidFields);
  }
}

// 执行校验
async function doValidateField(fields: FormItemContext[] = []) {
  let validateErrors: ValidateFieldsError = {};
  for (const field of fields) {
    try {
      await field.validate('');
    } catch (error) {
      validateErrors = {
        ...validateErrors,
        ...(error as ValidateFieldsError),
      };
    }
  }
  if (!size(Object.keys(validateErrors))) {
    return true;
  };
  return Promise.reject(validateErrors);
}

const resetFields: FormInstance['resetFields'] = function(keys) {
  each(filterFields(fields, keys ?? []), (field) => {
    field.resetField();
  });
}

const clearValidate: FormInstance['clearValidate'] = (keys) => {
  each(filterFields(fields, keys ?? []), (field) => {
    field.clearValidate();
  });
}

const addField: FormContext['addField'] = (field) => {
  if (!field.prop) return
  fields.push(field);
};

const removeField: FormContext['removeField'] = (field) => {
  if (!field.prop) return
  fields.splice(fields.indexOf(field), 1);
};

const formCtx: FormContext = reactive({
  ...toRefs(props),
  emits,
  addField,
  removeField,
})

provide(FORM_CTX_KEY, formCtx);

defineExpose<FormInstance>({
  validate,
  validateField,
  resetFields,
  clearValidate,
})
</script>

<template>
  <div class="er-form">
    <slot></slot>
  </div>
</template>