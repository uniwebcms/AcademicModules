import React, { useEffect, useState } from 'react';
import { Listbox } from '@headlessui/react';
import { twJoin, website } from '@uniwebcms/module-sdk';
import { IoMdMoon } from 'react-icons/io';
import { IoSunnySharp } from 'react-icons/io5';
import { PiDesktopBold } from 'react-icons/pi';

const themeMap = [
    {
        name: 'Light',
        value: 'light',
        icon: IoSunnySharp,
        label: { en: 'Light', fr: 'Clair' },
    },
    {
        name: 'Dark',
        value: 'dark',
        icon: IoMdMoon,
        label: { en: 'Dark', fr: 'Sombre' },
    },
    {
        name: 'System',
        value: 'system',
        icon: PiDesktopBold,
        label: { en: 'System', fr: 'Système' },
    },
];

function LightIcon(props) {
    return (
        <svg aria-hidden="true" viewBox="0 0 16 16" {...props}>
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7 1a1 1 0 0 1 2 0v1a1 1 0 1 1-2 0V1Zm4 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm2.657-5.657a1 1 0 0 0-1.414 0l-.707.707a1 1 0 0 0 1.414 1.414l.707-.707a1 1 0 0 0 0-1.414Zm-1.415 11.313-.707-.707a1 1 0 0 1 1.415-1.415l.707.708a1 1 0 0 1-1.415 1.414ZM16 7.999a1 1 0 0 0-1-1h-1a1 1 0 1 0 0 2h1a1 1 0 0 0 1-1ZM7 14a1 1 0 1 1 2 0v1a1 1 0 1 1-2 0v-1Zm-2.536-2.464a1 1 0 0 0-1.414 0l-.707.707a1 1 0 0 0 1.414 1.414l.707-.707a1 1 0 0 0 0-1.414Zm0-8.486A1 1 0 0 1 3.05 4.464l-.707-.707a1 1 0 0 1 1.414-1.414l.707.707ZM3 8a1 1 0 0 0-1-1H1a1 1 0 0 0 0 2h1a1 1 0 0 0 1-1Z"
            />
        </svg>
    );
}

function DarkIcon(props) {
    return (
        <svg aria-hidden="true" viewBox="0 0 16 16" {...props}>
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.23 3.333C7.757 2.905 7.68 2 7 2a6 6 0 1 0 0 12c.68 0 .758-.905.23-1.332A5.989 5.989 0 0 1 5 8c0-1.885.87-3.568 2.23-4.668ZM12 5a1 1 0 0 1 1 1 1 1 0 0 0 1 1 1 1 0 1 1 0 2 1 1 0 0 0-1 1 1 1 0 1 1-2 0 1 1 0 0 0-1-1 1 1 0 1 1 0-2 1 1 0 0 0 1-1 1 1 0 0 1 1-1Z"
            />
        </svg>
    );
}

function SystemIcon(props) {
    return (
        <svg aria-hidden="true" viewBox="0 0 16 16" {...props}>
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M1 4a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v4a3 3 0 0 1-3 3h-1.5l.31 1.242c.084.333.36.573.63.808.091.08.182.158.264.24A1 1 0 0 1 11 15H5a1 1 0 0 1-.704-1.71c.082-.082.173-.16.264-.24.27-.235.546-.475.63-.808L5.5 11H4a3 3 0 0 1-3-3V4Zm3-1a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H4Z"
            />
        </svg>
    );
}

function disableTransitionsTemporarily() {
    document.documentElement.classList.add('[&_*]:!transition-none');
    window.setTimeout(() => {
        document.documentElement.classList.remove('[&_*]:!transition-none');
    }, 0);
}

function toggleMode(theme) {
    disableTransitionsTemporarily();

    if (theme === 'system') {
        const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const isSystemDarkMode = darkModeMediaQuery.matches;
        document.documentElement.classList.toggle('dark', isSystemDarkMode);
    } else {
        document.documentElement.classList.toggle('dark', theme === 'dark');
    }

    window.localStorage.setItem('theme', theme);
}

export function ThemeSelector({ theme, setTheme, ...props }) {
    const [mounted, setMounted] = useState(false);

    const isSystemDarkMode =
        theme === 'system' &&
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches;

    const finalTheme = theme === 'system' ? (isSystemDarkMode ? 'dark' : 'light') : theme;

    useEffect(() => {
        setMounted(true);
        toggleMode(theme);
    }, [theme]);

    if (!mounted) {
        return <div className="h-6 w-6" />;
    }

    return (
        <Listbox as="div" value={theme} onChange={setTheme} {...props}>
            <Listbox.Label className="sr-only">Theme</Listbox.Label>
            <Listbox.Button className="flex focus:outline-none" aria-label="Theme">
                {finalTheme === 'light' && (
                    <IoSunnySharp className="h-5 w-5 text-icon-color hover:text-icon-color/60 transition-colors duration-200" />
                )}
                {finalTheme === 'dark' && (
                    <IoMdMoon className="h-5 w-5 text-icon-color hover:text-icon-color/60 transition-colors duration-200" />
                )}
            </Listbox.Button>
            <Listbox.Options className="absolute z-50 top-full -right-5 bg-text-color-0 rounded-lg ring-1 ring-text-color/20 shadow-lg overflow-hidden w-32 py-1 text-sm font-semibold mt-4 translate-x-2">
                {themeMap.map((themeItem) => (
                    <Listbox.Option
                        key={themeItem.name}
                        value={themeItem.value}
                        className={({ active, selected }) =>
                            twJoin(
                                'flex cursor-pointer select-none items-center px-2 py-1.5',
                                !selected ? 'text-text-color/90' : 'text-text-color',
                                active && 'bg-text-color/10'
                            )
                        }
                    >
                        {({ selected }) => (
                            <>
                                <div className="flex items-center">
                                    <themeItem.icon
                                        className={twJoin(
                                            'h-5 w-5',
                                            selected ? 'text-icon-color' : 'text-text-color/70'
                                        )}
                                    />
                                </div>
                                <div className="ml-3">{website.localize(themeItem.label)}</div>
                            </>
                        )}
                    </Listbox.Option>
                ))}
            </Listbox.Options>
        </Listbox>
    );
}
