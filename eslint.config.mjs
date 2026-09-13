// @ts-check

import js from '@eslint/js'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import prettierRecommended from 'eslint-plugin-prettier/recommended'
import globals from 'globals'

/** @type {import('eslint').Linter.Config[]} */
const config = [
  {
    ignores: ['dist/**'],
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    languageOptions: {
      globals: globals.node,
    },
  },
  js.configs.recommended,
  ...tsPlugin.configs['flat/recommended'],
  prettierRecommended,
  {
    rules: {
      'prettier/prettier': 'warn',
    },
  },
]

export default config
