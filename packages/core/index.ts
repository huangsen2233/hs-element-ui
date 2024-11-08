import { makeInstaller } from "@hs-element-ui/utils"
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import components from "./components"
import '@hs-element-ui/theme/index.css'  // 引入主题样式

// 使用 library 机制一次性添加所有 fontawesome 图标
library.add(fas)

// app.use() 使用插件的方式将组件挂载到 vue 实例上
const installer = makeInstaller(components)  

export * from '@hs-element-ui/components'
export default installer