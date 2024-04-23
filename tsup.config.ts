import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'src/generate/index.ts', 'src/validate/index.ts'],
  dts: true,
  sourcemap: true,
  target: 'es5',
  format: ['cjs', 'esm', 'iife'],
  globalName: 'promptparse',
})
