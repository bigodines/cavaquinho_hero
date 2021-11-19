module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es2021: true,
        node: true,
        jest: true
    },
    extends: [
        'standard',
        'plugin:react/recommended'
    ],
    plugins: [
        'react'
    ],
    parserOptions: {
        ecmaVersion: 12
    },
    rules: {
        indent: ['error', 4],
        'space-before-function-paren': ['error', 'never']
    }
}
