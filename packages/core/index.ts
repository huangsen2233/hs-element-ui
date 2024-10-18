import { makeInstaller } from "@hs-element-ui/utils"
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import components from "./components"
import '@hs-element-ui/theme/index.css'

library.add(fas) // 添加 fortawesome 图标

const installer = makeInstaller(components)  // app.use() 使用插件的方式将组件挂载到 vue 实例上

export * from '@hs-element-ui/components'
export default installer