import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createHtmlPlugin } from 'vite-plugin-html'

// https://vitejs.dev/config/
export default defineConfig((({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [
      vue(),
      createHtmlPlugin({
        inject: { data: { title: env.VITE_APP_TITLE } }, // 动态注入应用标题
      }),
    ],
    server: {
      open: true, // 启动服务时自动打开浏览器
    }
  }
}))
