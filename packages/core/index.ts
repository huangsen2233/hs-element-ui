import { makeInstaller } from "@hs-element-ui/utils"
import components from "./components"
import '@hs-element-ui/theme/index.css'

// app.use() 使用插件的方式将组件挂载到 vue 实例上
const installer = makeInstaller(components)

export * from '@hs-element-ui/components'
export default installer