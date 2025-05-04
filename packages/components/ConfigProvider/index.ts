import ConfigProvider from "./ConfigProvider.vue";
import { withInstall }from '@hs-element-ui/utils'

export const HsConfigProvider = withInstall(ConfigProvider)

export * from './types'
export * from './hooks'