import React from 'react';
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

export function ThemeSelector({ theme, finalTheme, setTheme, ...props }) {
    return (
        <Listbox as="div" value={theme} onChange={setTheme} {...props}>
            <Listbox.Label className="sr-only">Theme</Listbox.Label>
            <Listbox.Button className="flex bg-transparent focus:outline-none" aria-label="Theme">
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
