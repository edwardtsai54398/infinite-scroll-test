import globals from 'globals'
import pluginVue from 'eslint-plugin-vue'

// const compat = new FlatCompat({
//   baseDirectory: path.resolve(__dirname),
//   recommendedConfig: js.configs.recommended,
//   allConfig: js.configs.all,
// })

export default [
  ...pluginVue.configs['flat/recommended'],
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {},
    },
    rules: {
      'vue/max-attributes-per-line': [
        'error',
        {
          singleline: 3,
          multiline: 1,
        },
      ],
      'vue/require-default-prop': 'off',
      'vue/html-self-closing': 'off',
    },
  },
]
