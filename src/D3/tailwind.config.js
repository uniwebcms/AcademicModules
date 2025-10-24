const path = require('path');

function makeEntryPath(libraryName, subpath = '**/*.{js,jsx,ts,tsx}') {
    return path.join(path.dirname(require.resolve(libraryName)), subpath);
}

module.exports = {
    content: ['../src/**/*.{js,jsx}', makeEntryPath('@uniwebcms/core-components')],
    plugins: [require('@uniwebcms/uniweb-tailwind-plugin'), require('@tailwindcss/typography')],
    theme: {
        extend: {
            colors: {},
            spacing: {
                '8xl': '88rem',
                '9xl': '96rem',
            },
            screens: {
                desktop: '1408px', // 88rem
            },
            typography: (theme) => ({
                DEFAULT: {
                    css: {
                        color: 'inherit',
                        a: {
                            color: 'inherit',
                            textDecoration: 'underline',
                        },
                        strong: {
                            color: 'inherit',
                            fontWeight: theme('fontWeight.bold'),
                        },
                        h1: {
                            color: 'inherit',
                        },
                        h2: {
                            color: 'inherit',
                        },
                        h3: {
                            color: 'inherit',
                        },
                        p: {
                            color: 'inherit',
                        },
                        'h4, h5, h6, blockquote': {
                            color: 'inherit',
                        },
                    },
                },
            }),
        },
    },
};
