import type { App, Plugin } from "vue";
import { each } from "lodash-es";
import {
    provideGlobalConfig,
    type ConfigProviderProps,
} from "@hs-element-ui/components";

// 全局引入 - 注册组件插件
export function makeInstaller(componets: Plugin[]) {
    const installer = (app: App, opts?: ConfigProviderProps) => {
        each(componets, (c) => app.use(c));
        if (opts) provideGlobalConfig(opts, app, true);
    };

    return installer as Plugin;
}

export default makeInstaller;