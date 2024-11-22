import { resolve } from "path";
import { defineConfig } from "vite";
import { last, split, first, includes } from "lodash-es";
import hooks from "./hooksPlugin";
import dts from "vite-plugin-dts";

export default defineConfig({
    plugins: [
        // 生成 .d.ts 类型声明文件
        dts({
            include: ["./**/*.ts"],
            exclude: ["./vite.config.ts"],
        }),
        hooks({
            rmFiles: ["./dist"],
        }),
    ],
    build: {
        minify: false,
        lib: {
            entry: resolve(__dirname, "./index.ts"),
            name: "hooks",
            fileName: "index",
            formats: ["es"],
        },
        rollupOptions: {
            external: ["vue", "lodash-es", "vue3-i18n"],
            output: {
                manualChunks(id) {
                    if (includes(id, "/packages/hooks/use"))
                        return first(split(last(split(id, "/")), "."));
                },
            },
        },
    },
});