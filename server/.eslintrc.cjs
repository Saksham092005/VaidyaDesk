module.exports = {
    root: true,
    env: {
        es2022: true,
        node: true,
    },
    extends: ["eslint:recommended"],
    parserOptions: {
        sourceType: "module",
    },
    rules: {
        indent: ["error", "tab", { SwitchCase: 1 }],
        "no-tabs": "off",
        quotes: ["error", "double", { allowTemplateLiterals: true }],
        semi: ["error", "always"],
        "comma-dangle": ["error", "always-multiline"],
        "space-before-function-paren": "off",
        "no-unused-vars": [
            "error",
            {
                argsIgnorePattern: "^_",
                varsIgnorePattern: "^_",
                destructuredArrayIgnorePattern: "^_",
            },
        ],
        "no-multiple-empty-lines": ["error", { max: 2, maxEOF: 1 }],
        "no-console": "off",
    },
};
