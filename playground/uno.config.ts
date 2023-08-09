import {
  defineConfig,
  presetUno,
} from 'unocss'

export default defineConfig({
  shortcuts: [
    ['btn', 'inline-block'],
  ],
  presets: [
    presetUno(),
  ],
})
