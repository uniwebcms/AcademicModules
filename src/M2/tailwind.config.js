const path = require('path');

function makeEntryPath(libraryName, subpath = '**/*.{js,jsx,ts,tsx}') {
    return path.join(path.dirname(require.resolve(libraryName)), subpath);
}

module.exports = {
    content: ['../src/**/*.{js,jsx}', makeEntryPath('@uniwebcms/core-components')],
    plugins: [
        require('@uniwebcms/uniweb-tailwind-plugin'),
        require('@tailwindcss/typography'),
        require('@headlessui/tailwindcss'),
    ],
    theme: {
        extend: {
            // You can add theme extensions here
            width: {
                112: '28rem',
            },
            spacing: {
                '8xl': '96rem',
                '9xl': '108rem',
            },
        },
    },
};
