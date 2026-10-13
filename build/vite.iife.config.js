import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  define: {
    'process.env.NODE_ENV': JSON.stringify('production')
  },
  plugins: [
    vue({
      template: {
        compilerOptions: {
          whitespace: 'preserve',
        }
      }
    }),
    tailwindcss(),
  ],
  build: {
    minify: false,
    emptyOutDir: false,
    lib: {
      entry: resolve(__dirname, '../src/index.global.ts'),
      name: 'VVPlotUI',
      fileName: 'vvplot-ui',
      cssFileName: "style.global"
    },
    rolldownOptions: {
      external: ['vue'],
      output: [
        {
          format: 'iife',
          entryFileNames: 'vvplot-ui.global.js',
          minifyInternalExports: false,
          name: 'VVPlotUI',
          globals: { vue: 'Vue' },
        },
        {
          format: 'iife',
          entryFileNames: 'vvplot-ui.global.min.js',
          minify: true,
          name: 'VVPlotUI',
          globals: { vue: 'Vue' },
        },
      ],
    },
  },
})
