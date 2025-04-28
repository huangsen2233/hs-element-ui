import Select from './Select.vue';
import Option from './Option.vue';
import { withInstall } from '@hs-element-ui/utils';

export const HsSelect = withInstall(Select)
export const HsOption = withInstall(Option)

export * from './types'