import path from 'node:path'
import { defineConfig } from 'vite'
import Unocss from 'unocss/vite'

export default defineConfig({
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
      '@fycosmos/board': path.resolve(__dirname, '../packages/core/src/index.ts'),
    },
  },
  plugins: [
    Unocss(),
  ],
})
