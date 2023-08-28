import {
  defineConfig,
  presetIcons,
  presetUno,
} from 'unocss'

export default defineConfig({
  shortcuts: [
    ['icon-btn', 'text-xl color-coolgray hover:color-dark w-5 h-5 m-2 inline-block pl cursor-pointer'],
    ['undo', 'i-carbon-undo'],
    ['redo', 'i-carbon-redo'],
    ['clear', 'i-carbon-clean'],
    ['pen', 'i-carbon-pen-fountain'],
    ['circle', 'i-carbon-circle-dash'],
    ['erase', 'i-carbon-erase'],
    ['line', 'i-carbon-arrow-down-right'],
    ['rect', 'i-carbon-3d-cursor'],
    ['print', 'i-ri-printer-line'],
    ['select', 'i-carbon-select-window'],
  ],
  presets: [
    presetUno(),
    presetIcons({
      scale: 1.2,
      warn: true,
    }),
  ],
})
