import { createApp } from 'vue'
import App from './App.vue'

import HsElementUi, { zhCn } from 'hs-element-ui'
import 'hs-element-ui/dist/index.css'

createApp(App).use(HsElementUi, { locale: zhCn }).mount('#app')