import { createApp } from 'vue'
import App from './App.vue'

import HsElementUiInstaller from 'hs-element-ui'
import 'hs-element-ui/dist/index.css'

createApp(App).use(HsElementUiInstaller).mount('#app')