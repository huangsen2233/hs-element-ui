import Form from './Form.vue';
import FormItem from './FormItem.vue';
import { withInstall } from '@hs-element-ui/utils';

export const HsForm = withInstall(Form);
export const HsFormItem = withInstall(FormItem);

export * from './types';
export * from './hooks';