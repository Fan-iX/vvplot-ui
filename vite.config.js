import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

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
    dts({ rollupTypes: true }),
  ],
  build: {
    minify: false,
    lib: {
      entry: {
        'vvplot-ui': resolve(__dirname, 'src/index.ts'),
        components: resolve(__dirname, 'src/components.ts'),
        directives: resolve(__dirname, 'src/directives.ts')
      },
      name: 'VVPlotUI',
      fileName: 'vvplot-ui',
      cssFileName: "style"
    },
    rolldownOptions: {
      external: ['vue', 'tailwind-merge'],
      output: [
        {
          format: 'es',
          chunkFileNames: 'chunk-[name].js',
          entryFileNames: '[name].esm.js',
          minifyInternalExports: false,
        },
      ],
    },
  },
})
