// https://eslint.org/docs/user-guide/configuring

module.exports = {

  extends: [
    'airbnb-base',
    'plugin:vue/recommended'
  ],
  env: {
    browser: true,
    "es6": true,
  },

  // required to lint *.vue files
  plugins: [
    'html',
  ],
  // check if imports actually resolve
  'settings': {
    'import/resolver': {
      'webpack': {
        'config': 'build/webpack.base.conf.js'
      }
    }
  },
  // add your custom rules here
  'rules': {
    // don't require .vue extension when importing
    'import/extensions': ['error', 'always', {
      'js': 'never',
      'vue': 'never'
    }],

    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-console': 'off',
    semi: ['error', 'never'],
    'linebreak-style': process.env.NODE_ENV === 'production' ? ['error', 'unix'] : ['error', 'windows'],
    'prefer-default-export': 'off',
    'prefer-template': 'off',
    'space-infix-ops': 'off',
    'func-names': 'off',
    'object-shorthand': 'off',
    'no-alert': 'off',
    'no-underscore-dangle': 'off',
    'no-param-reassign': 'off',
    'max-len': 'off',
    'no-use-before-define': 'off',
  }
}
