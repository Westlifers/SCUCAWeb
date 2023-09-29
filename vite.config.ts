import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://github.com/vitejs/vite/blob/ec7ee22cf15bed05a6c55693ecbac27cfd615118/packages/vite/src/node/plugins/workerImportMetaUrl.ts#L127-L128
const workerImportMetaUrlRE =
    /\bnew\s+(?:Worker|SharedWorker)\s*\(\s*(new\s+URL\s*\(\s*('[^']+'|"[^"]+"|`[^`]+`)\s*,\s*import\.meta\.url\s*\))/g

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  // 解决跨域配置
  server: {                //记住，别写错了devServer//设置本地默认端口  选填
    port: 8080,
    proxy: {                 //设置代理，必须填
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    }
  },

  define: {
    'process.env': {}
  },

  build: {
    //打包
    assetsDir: './static', //放置生成的静态资源
    rollupOptions: {
      external: ['vite'],
    },
  },

  worker: {  // 这是cubing.js的一个bug，不加此配置则无法直接编译，见issue: https://github.com/cubing/cubing.js/issues/296
    format: 'es',
    plugins: [
      {
        name: 'foo',
        enforce: 'pre',
        transform(code, id) {
          if (code.includes('new Worker') && code.includes('new URL') && code.includes('import.meta.url')) {
            const result = code.replace(workerImportMetaUrlRE, `((() => { throw new Error('Nested workers are disabled') })()`)
            return result
          }
        }
      }
    ],
    rollupOptions: {
      output: {
        chunkFileNames: 'assets/worker/[name]-[hash].js',
        assetFileNames: 'assets/worker/[name]-[hash].js'
      }
    }
  }

})
