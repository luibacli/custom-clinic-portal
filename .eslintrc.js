module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:vue/vue3-recommended',
        'plugin:prettier/recommended'
    ],
    parserOptions: {
        ecmaVersion: 2021,
    },
    rules: {
        'semi': ['error', 'always'],
        'quotes': ['error', 'single']
    }
};
