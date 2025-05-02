<script setup lang="ts">
import {
  nextTick, inject, onMounted,
  onUnmounted, reactive, toRefs,
  computed, ref, type Ref,
  provide,
} from 'vue';
import { FORM_CTX_KEY, FORM_ITEM_CTX_KEY } from './constants';
import type {
  FormItemContext,
  FormItemProps,
  FormValidateFailuer,
  FormValidateCallback,
  ValidateStatus,
  FormItemInstance,
  FormItemRule,
} from "./types";
import {
  isNil, get, isString,
  size, filter, map,
  includes, keys, isArray,
  cloneDeep, some, isNumber,
  endsWith,
} from 'lodash-es';
import Schema, { type RuleItem } from 'async-validator';
import { useId } from '@hs-element-ui/hooks';

defineOptions({
  name: 'HsFormItem',
});

const props = withDefaults(defineProps<FormItemProps>(), {
  required: void 0,
  showMessage: true,
});
const slots = defineSlots();
const ctx = inject(FORM_CTX_KEY);

const labelId = useId().value

// 表单项校验的状态
const validateStatus: Ref<ValidateStatus> = ref('init');

const errMsg = ref('');

const inputIds = ref<string[]>([]);

const hasLabel = computed(() => !!(props.label || slots.label))
// label 元素的 for 属性匹配关联到表单元素的 id 属性
const labelFor = computed(() => props.for || (inputIds.value.length ? inputIds.value[0] : ''))
const currentLabel = computed(() => `${props.label ?? ''}${ctx?.labelSuffix ?? ''}`)

const normalizeLabelWidth = computed(() => {
  const _normalizeStyle = (val: number | string) => {
    if (isNumber(val)) return `${val}px`;
    return endsWith(val, "px") ? val : `${val}px`;
  };
  if (props.labelWidth) return _normalizeStyle(props.labelWidth);
  if (ctx?.labelWidth) return _normalizeStyle(ctx?.labelWidth);
  return "150px";
})

const isDisabled = computed(() => {
  return ctx?.disabled || props.disabled;
});

const isRequired = computed(() => !ctx?.hideRequiredAsterisk && some(itemRules.value, 'required') || props?.required);

// 根据 prop 获取 rules 或 model[prop] 表单项的值
const getValByProp = (target: Record<string, any> | void) => {
  if (target && props.prop && !isNil(get(target, props.prop))) {
    return get(target, props.prop);
  }
  return null;
}

// 表单项的值
const innerVal = computed(() => {
  const model = ctx?.model
  return getValByProp(model) || initialVal
})

// 表单项 prop 的类型: string | string[]
const propString = computed(() => {
  if (!props.prop) return ''
  return isString(props.prop) ? props.prop : props.prop.join('.')
})

// 动态覆盖 required 并生成 rules
const itemRules = computed(() => {
  const rules: FormItemRule[] = []
  if (props.rules) {
    rules.push(...props.rules)
  }
  const formRules = ctx?.rules
  if (formRules && props.prop)  {
    const _rules = getValByProp(formRules)
    if (_rules) {
      rules.push(..._rules)
    }
  }
  // FormItem 组件 rules 的 required 优先级高于 Form 组件的 required，会覆盖 Form 组件的 required
  const { required } = props
  if (!isNil(required)) {
    // 获取包含 required 属性的规则并记录索引
    const requiredRules = filter(
      map(rules, (rule, i) => [rule, i]),
      (item: [FormItemRule, number]) => includes(keys(item[0]), "required")
    );
    if (size(requiredRules)) {
      for (const item of requiredRules) {
        const [rule, i] = item as [FormItemRule, number];
        if (rule.required === required) continue;
        // FormItem 组件的 required 属性覆盖 Form 组件的 required 属性
        rules[i] = { ...rule, required };
      }
    } else {
      // 添加一个 required 属性的规则
      rules.push({ required });
    }
  }

  return rules;
})

// 表单项初始值
let initialVal: any = null

// 执行 resetField 函数时，validate 函数不需要执行
let isResetting: boolean = false

// 根据传入的触发方式及规则进行校验
const validate: FormItemInstance['validate'] = async function(
  tigger: string,
  callback?: FormValidateCallback,
) {
  if (isResetting || !props.prop || isDisabled.value) return false
  if (!validateStatus.value) {
    callback?.(false)
    return false
  }
  const rules = getTriggeredRules(tigger)
  if (!size(rules)) {
    callback?.(true)
  }
  validateStatus.value = 'validating'
  return doValidate(rules as  RuleItem[]).then(() => {
    callback?.(true)
    return true
  }).catch((err: FormValidateFailuer) => {
    const { fields } = err
    callback?.(false, fields)
    return Promise.reject(fields)
  })
}

// 根据触发方式 tigger 过滤出 rules
function getTriggeredRules(trigger: string) {
  const rules = itemRules.value
  if (!rules) return []
  return filter(rules, (r) => {
    // 没有触发方式即任何事件都需要校验
    if (!r.trigger || !trigger) return true
    if (isArray(r.trigger)) {
      return r.trigger.includes(trigger)
    }
    return r.trigger === trigger
    // 去除 trigger 属性
  }).map(({trigger, ...rule}) => rule as RuleItem)
}

// 校验表单项
async function doValidate(rules: RuleItem[]) {
  const modelName = propString.value
  const validator = new Schema({
    [modelName]: rules,
  });
  return validator.validate(
    { [modelName]: innerVal.value },
    { firstFields: true,}
  ).then(() => {
    validateStatus.value = 'success'
    ctx?.emits('validate', props, true, '')
    return true
  }).catch((err: FormValidateFailuer) => {
    const { errors } = err
    validateStatus.value = 'error'
    errMsg.value = errors && size(errors) > 0 ? errors[0].message ?? '' : ''
    ctx?.emits('validate', props, false, errMsg.value)
    return Promise.reject(err)
  })
}

const resetField: FormItemInstance['resetField'] = function() {
  const model = ctx?.model
  if (model && propString.value && !isNil(get(model, propString.value))) {
    isResetting = true
    model[propString.value] = cloneDeep(initialVal)
  }
  nextTick(() => clearValidate())
}

const clearValidate: FormItemInstance['clearValidate'] = function() {
  validateStatus.value = 'init'
  errMsg.value = ''
  isResetting = false
}

const addInputId: FormItemContext['addInputId'] = function(id) {
  if (!includes(inputIds.value, id)) {
    inputIds.value.push(id);
  }
}

const removeInputId: FormItemContext['removeInputId'] = function(id) {
  inputIds.value = filter(inputIds.value, (i) => i !== id);
}

const formItemCtx: FormItemContext = reactive({
  ...toRefs(props),
  disabled: isDisabled,
  validate,
  resetField,
  clearValidate,
  addInputId,
  removeInputId,
});

onMounted(() => {
  if (props.prop) {
    // 将表单项添加到 Form 组件的 fields 字段数组
    ctx?.addField(formItemCtx);
    initialVal = innerVal.value;
  }
});

onUnmounted(() => {
  if (props.prop) {
    // 从 Form 组件的 fields 字段数组中移除表单项
    ctx?.removeField(formItemCtx);
  }
});

provide<FormItemContext>(FORM_ITEM_CTX_KEY, formItemCtx);

defineExpose<FormItemInstance>({
  validateMessage: errMsg,
  validateStatus,
  validate,
  resetField,
  clearValidate,
});
</script>

<template>
  <div
    class="er-form-item"
    :class="{
      'is-error': validateStatus === 'error',
      'is-disabled': isDisabled,
      'is-required': isRequired,
      'asterisk-left': ctx?.requiredAsteriskPosition === 'left',
      'asterisk-right': ctx?.requiredAsteriskPosition === 'right',
    }"
  >
    <component
      v-if="hasLabel"
      class="er-form-item__label"
      :class="`position-${ctx?.labelPosition ?? `right`}`"
      :is="labelFor ? 'label' : 'div'"
      :id="labelId"
      :for="labelFor"
    >
      <slot name="label" :label="currentLabel">
        {{ currentLabel }}
      </slot>
    </component>
    <div class="er-form-item__content">
      <slot name="default" :validate="validate"></slot>
      <div class="er-form-item__error-msg" v-if="validateStatus === 'error'">
        <template v-if="ctx?.showMessage && showMessage">
          <slot name="error" :error="errMsg">{{ errMsg }}</slot>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import './style.css';

.er-form-item {
  --er-form-lebel-width: v-bind(normalizeLabelWidth) !important;
}
</style>