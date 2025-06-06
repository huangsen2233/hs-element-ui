import { createApp } from 'vue'
import App from './App.vue'

import HsElementPlus, { zhCn, zhTw, ja } from 'hs-element-plus'
import 'hs-element-plus/dist/index.css'

createApp(App).use(HsElementPlus, { locale: zhTw }).mount('#app')
// createApp(App).mount('#app')