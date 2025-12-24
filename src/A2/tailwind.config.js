const path = require('path');

function makeEntryPath(libraryName, subpath = '**/*.{js,jsx,ts,tsx}') {
    return path.join(path.dirname(require.resolve(libraryName)), subpath);
}

module.exports = {
    content: ['../src/**/*.{js,jsx}', makeEntryPath('@uniwebcms/core-components')],
    plugins: [
        require('@uniwebcms/uniweb-tailwind-plugin'),
        require('@tailwindcss/typography'),
        require('@tailwindcss/container-queries'),
    ],
    theme: {
        extend: {
            fontSize: {
                md: ['15px', '22px'],
            },
            typography: (theme) => ({
                DEFAULT: {
                    css: {
                        color: 'inherit',
                        a: {
                            color: 'var(--link-color, inherit)',
                            textDecoration: 'underline',
                        },
                        strong: {
                            color: 'inherit',
                            fontWeight: theme('fontWeight.bold'),
                        },
                        h1: {
                            color: 'var(--heading-color, inherit)',
                        },
                        h2: {
                            color: 'var(--heading-color, inherit)',
                        },
                        h3: {
                            color: 'var(--heading-color, inherit)',
                        },
                        p: {
                            color: 'var(--text-color, inherit)',
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
