module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2020,
    sourceType: 'module',
    jsxPragma: 'React',
    ecmaFeatures: {
      jsx: true
    }
  },
  globals: {
    // script setup
    defineProps: 'readonly',
    defineEmits: 'readonly',
    defineExpose: 'readonly',
    withDefaults: 'readonly',
    // unplugin-vue-define-options
    defineOptions: 'readonly'
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-essential',
    '@vue/typescript/recommended',
    '@vue/prettier',
    // '@vue/eslint-config-typescript',
    'plugin:prettier/recommended'
  ],
  rules: {
    // TS
    '@typescript-eslint/no-explicit-any': 'off',
    'no-debugger': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_'
      }
    ],
    'no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_'
      }
    ],
    // Vue
    'vue/no-v-html': 'off',
    'vue/require-default-prop': 'off',
    'vue/require-explicit-emits': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/html-self-closing': [
      'error',
      {
        html: {
          void: 'always',
          normal: 'always',
          component: 'always'
        },
        svg: 'always',
        math: 'always'
      }
    ],
    // Prettier
    'prettier/prettier': [
      'error',
      {
        /** 每一行的宽度 */
        printWidth: 160,
        /** Tab 键的空格数 */
        tabWidth: 2,
        /** 在对象中的括号之间是否用空格来间隔 */
        bracketSpacing: true,
        /** 箭头函数的参数无论有几个，都要括号包裹 */
        arrowParens: 'always',
        /** 换行符的使用 */
        endOfLine: 'auto',
        /** 是否采用单引号 */
        singleQuote: true,
        /** 对象或者数组的最后一个元素后面不要加逗号 */
        trailingComma: 'none',
        /** 是否加分号 */
        semi: false,
        /** 是否使用 Tab 格式化 */
        useTabs: false
      }
    ],
    quotes: 'off'
  }
}
