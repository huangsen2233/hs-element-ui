import { makeInstaller } from "@hs-element-ui/utils"
import components from "./components"
import '@hs-element-ui/theme/index.css'

// 允许开发人员使用插件的方式使用组件 app.use() 挂载到 vue 实例上
const installer = makeInstaller(components)

export * from '@hs-element-ui/components'
export default installer