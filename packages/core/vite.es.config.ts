import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

const COMPONENT_NAMES = [
    'Alert', 'Button', 'Collapse', 'Dropdown', 'Form', 'Icon', 'Input',
    'Loading', 'Message', 'MessageBox', 'Notification', 'Overlay', 
    'Popconfirm', 'Select', 'Switch', , 'Tooltip', 'Upload'
]

export default defineConfig({
    plugins: [
        vue(), 
        // 该插件用于自动生成类型文件
        dts({ 
            tsconfigPath: '../../tsconfig.build.json', // 指定 tsconfig 文件路径
            outDir: 'dist/types', // 指定输出目录
        })
    ],
    build: {
        outDir: 'dist/es', 
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
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name === 'style.css') {
                        return 'index.css'
                    }
                    return assetInfo.name as string
                },
                // 分包
                manualChunks: (id) => {
                    if (id.includes('node_modules')) {
                        return 'vendor'
                    }
                    if (id.includes('/packages/hooks')) {
                        return 'hooks'
                    }
                    if (id.includes('/packages/utils')) {
                        return 'utils'
                    }
                    for (const item of COMPONENT_NAMES) {
                        if (id.includes(`/packages/components/${item}`)) {
                            return item
                        }
                    }
                }
            },
        }
    }
})