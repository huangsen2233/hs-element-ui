import DefaultTheme from "vitepress/theme";
import { type App } from "vue";
import HsElementUi, { zhCn } from "hs-element-plus";
import { ElementPlusContainer } from "@vitepress-preview/component";

import "@vitepress-preview/component/style.css";
import "hs-element-plus/dist/index.css";

export default {
  ...DefaultTheme,
  enhanceApp({ app }: { app: App }) {
    app.component("demo-preview", ElementPlusContainer);
    app.use(HsElementUi, { locale: zhCn });
  },
};
