import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
    plugins: [vue()],
    build: {
        outDir: 'dist/umd', 
        lib: {
            entry: resolve(__dirname, './index.ts'),
            name: 'HsElementUi', // 库的全局变量名
            fileName: 'index',
            formats: ['umd'], // 指定构建的模块格式为 UMD(Universal Module Definition ),构建后的代码将兼容多种模块加载方式
        },
        rollupOptions: {
            external: ['vue'],
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