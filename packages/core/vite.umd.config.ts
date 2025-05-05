import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { compression } from 'vite-plugin-compression2'
import { readFile } from 'fs'
import { resolve } from 'path'
import shell from 'shelljs'
import { delay, defer } from 'lodash-es'
import hooks from './hooksPlugin'
import terser from '@rollup/plugin-terser'
import { visualizer } from 'rollup-plugin-visualizer'

const TRY_MOVE_STYLES_DELAY = 800 as const

function moveStyles() {
    // try {
    //     readFileSync('./dist/umd/index.css.gz')
    //     // 复制文件到 dist 目录
    //     shell.cp('./dist/umd/index.css', './dist//index.css')
    // } catch (_) { 
    //     delay(moveStyle, TRY_MOVE_STYLES_DELAY)
    // }

    readFile("./dist/umd/index.css.gz", (err) => {
        if (err) return delay(moveStyles, TRY_MOVE_STYLES_DELAY);
        defer(() => shell.cp("./dist/umd/index.css", "./dist/index.css"));
    });
}

const isProd = process.env.NODE_ENV === "production"
const isDev = process.env.NODE_ENV === "development"
const isTest = process.env.NODE_ENV === "test"

export default defineConfig({
    plugins: [
        vue(),
        visualizer({ filename: './dist/stats.umd.html' }),
        // 压缩 umd 格式的打包产物为 gz 格式
        compression({
            include: /.(cjs|css)$/i,
        }),
        // 自定义插件，在打包前后处理 css 文件
        hooks({
            rmFiles: ['./dist/umd', './dist/index.css'],
            afterBuild: moveStyles
        }),
        terser({
            compress: {
                drop_console: ["log"], // 生产环境移除 console
                drop_debugger: true, // 移除 debugger
                passes: 3, // 压缩次数
                global_defs: {
                    "@DEV": JSON.stringify(isDev),
                    "@PROD": JSON.stringify(isProd),
                    "@TEST": JSON.stringify(isTest),
                },
            }
        }),
    ],
    build: {
        outDir: 'dist/umd',
        lib: {
            entry: resolve(__dirname, './index.ts'),
            name: 'HsElementUi', // 库的全局变量名
            fileName: 'index',
            formats: ['umd'], // 指定构建的模块格式为 UMD(Universal Module Definition ),构建后的代码将兼容多种模块加载方式
        },
        rollupOptions: {
            external: ['vue'], // 排除 vue，不打包
            output: {
                exports: 'named',
                globals: {
                    vue: 'Vue',
                },
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name === 'style.css') {
                        return 'index.css'
                    }
                    return assetInfo.name as string
                },
            },
        }
    }
})