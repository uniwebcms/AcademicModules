const path = require('path');

function makeEntryPath(libraryName, subpath = '**/*.{js,jsx,ts,tsx}') {
    return path.join(path.dirname(require.resolve(libraryName)), subpath);
}

module.exports = {
    content: ['../src/**/*.{js,jsx}', makeEntryPath('@uniwebcms/module-sdk')],
    theme: {},
    plugins: [makeEntryPath('@uniwebcms/module-sdk', 'plugin')],
};
