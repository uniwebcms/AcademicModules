const path = require('path');

function makeEntryPath(libraryName, subpath = '**/*.{js,jsx,ts,tsx}') {
    return path.join(path.dirname(require.resolve(libraryName)), subpath);
}

module.exports = {
    content: [
        '../src/**/*.{js,jsx}',
        makeEntryPath('@uniwebcms/core-components'),
        makeEntryPath('flowbite-react'),
    ],
    plugins: [require('@uniwebcms/uniweb-tailwind-plugin'), require('@tailwindcss/typography')],
    theme: {
        extend: {
            // You can add theme extensions here
            colors: {},
            spacing: {
                '8xl': '96rem',
                '9xl': '108rem',
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
            // Adding custom color themes for the typography "prose" class
            // @see: https://github.com/tailwindlabs/tailwindcss-typography?tab=readme-ov-file#adding-custom-color-themes
            // Customizing the CSS for "prose"
            // @see https://github.com/tailwindlabs/tailwindcss-typography?tab=readme-ov-file#customizing-the-css
        },
    },
};
