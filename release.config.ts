import { defineConfig } from '@fycosmos/release-cli'

export default defineConfig({
  commit: true,
  tag: false,
  push: false,
  recursive: true,
})
