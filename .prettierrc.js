module.exports = {
    trailingComma: 'es5',
    arrowParens: 'always',
    singleQuote: true,
    proseWrap: 'never',
    tabWidth: 4,
    printWidth: 100,
    overrides: [
        { files: '*.yml', options: { tabWidth: 2 } },
        { files: '*.yaml', options: { tabWidth: 2 } },
    ],
};
