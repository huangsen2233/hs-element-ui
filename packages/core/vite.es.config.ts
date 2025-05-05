import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'
import { readdirSync, readdir } from 'fs'
import { filter, map, delay, defer } from 'lodash-es'
import shell from 'shelljs'
import hooks from './hooksPlugin'
import terser from '@rollup/plugin-terser'
import { visualizer } from 'rollup-plugin-visualizer'

// const COMPONENT_NAMES = [
//     'Alert', 'Button', 'Collapse', 'Dropdown', 'Form', 'Icon', 'Input',
//     'Loading', 'Message', 'MessageBox', 'Notification', 'Overlay', 
//     'Popconfirm', 'Select', 'Switch', , 'Tooltip', 'Upload'
// ]

// 读取组件目录文件，返回组件名
function getDirectoriesSync(basePath: string) {
    const entries = readdirSync(basePath, {  withFileTypes: true })
    return map(
        filter(entries, (entry) => entry.isDirectory()),
        (entry) => entry.name
    )
}

const TRY_MOVE_STYLES_DELAY = 800 as const

// 移动样式文件
function moveStyles() {
    // try {
    //     readdirSync('./dist/es/theme')
    //     shell.mv('./dist/es/theme', './dist')
    // } catch (_) {
    //     delay(moveStyles, TRY_MOVE_STYLES_DELAY)
    // }

    readdir("./dist/es/theme", (err) => {
        if (err) return delay(moveStyles, TRY_MOVE_STYLES_DELAY);
        defer(() => shell.mv("./dist/es/theme", "./dist"))
    })
}

const isProd = process.env.NODE_ENV === "production"
const isDev = process.env.NODE_ENV === "development"
const isTest = process.env.NODE_ENV === "test"

export default defineConfig({
    plugins: [
        vue(),
        visualizer({
            filename: "dist/stats.es.html",
        }),
        // 该插件用于生成类型提示文件
        dts({
            tsconfigPath: '../../tsconfig.build.json', // 指定 tsconfig 配置文件路径
            outDir: 'dist/types', // 指定输出目录
        }),
        // 自定义插件，在打包前后处理 css 文件
        hooks({
            rmFiles: ['./dist/es', './dist/theme', './dist/types'],
            afterBuild: moveStyles
        }),
        terser({
            // 压缩
            compress: {
                sequences: isProd,
                arguments: isProd,
                drop_console: isProd && ["log"], // 生产环境移除 console
                drop_debugger: isProd, // 移除 debugger
                passes: isProd ? 4 : 1, // 压缩次数
                global_defs: {
                    "@DEV": JSON.stringify(isDev),
                    "@PROD": JSON.stringify(isProd),
                    "@TEST": JSON.stringify(isTest),
                },
            },
            // 格式化
            format: {
                semicolons: false,
                shorthand: isProd,
                braces: !isProd,
                beautify: !isProd,
                comments: !isProd,
            },
            // 混淆
            mangle: {
                toplevel: isProd,
                eval: isProd,
                keep_classnames: isDev,
                keep_fnames: isDev,
            },
        }),
    ],
    build: {
        outDir: 'dist/es',
        cssCodeSplit: true, // 开启 CSS 代码分包
        minify: false,
        lib: {
            entry: resolve(__dirname, './index.ts'),
            name: 'HsElementUi', // 库的全局变量名
            fileName: 'index',
            formats: ['es'],
        },
        rollupOptions: {
            external: [
                'vue',
                "@fortawesome/fontawesome-svg-core",
                "@fortawesome/free-solid-svg-icons",
                "@fortawesome/vue-fontawesome",
                "async-validator",
            ],
            output: {
                // 样式分包
                assetFileNames: (assetInfo) => {
                    // assetInfo.name 已经被弃用了，推荐使用 assetInfo.names 替代
                    if (assetInfo.name === 'style.css') {
                        return 'index.css'
                    }
                    if (assetInfo.type === 'asset' && /\.(css)$/i.test(assetInfo.name as string)) {
                        return 'theme/[name].[ext]'
                    }
                    return assetInfo.name as string
                },
                // js逻辑分包
                manualChunks: (id) => {
                    if (id.includes('node_modules')) {
                        return 'vendor'
                    }
                    if (id.includes('/packages/hooks')) {
                        return 'hooks'
                    }
                    // plugin-vue:export-helpe 是 vue 插件生成的文件，需要单独提出来，不然组件会因为加载顺序报错
                    if (id.includes('/packages/utils') || id.includes("plugin-vue:export-helper")) {
                        return 'utils'
                    }
                    // for (const item of COMPONENT_NAMES) {
                    //     if (id.includes(`/packages/components/${item}`)) {
                    //         return item
                    //     }
                    // }
                    for (const dirName of getDirectoriesSync('../components')) {
                        if (id.includes(`/packages/components/${dirName}`)) {
                            return dirName
                        }
                    }
                }
            },
        }
    }
})