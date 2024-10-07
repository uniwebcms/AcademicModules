/**
 * Webpage language toggle widget
 * @module LanguageToggle
 */

import React, { Fragment } from 'react';
import { website, twMerge, localize } from '@uniwebcms/module-sdk';
import { MdLanguage } from 'react-icons/md';
import { Transition, Popover } from '@headlessui/react';
import { ImRadioChecked } from 'react-icons/im';

/**
 * Create a language toggle widget for the active website
 *
 * @example
 * function MyComponent() {
 *    return (
 *       <LanguageToggle />
 *    );
 * }
 *
 * @component LanguageToggle
 * @returns {function} A language toggle component.
 */
export default function (props) {
    const currentLang = website.getLanguage();
    const langOptions = website.getLanguages();

    const labels = {
        en: 'English',
        fr: 'Français'
    };

    if (langOptions && Array.isArray(langOptions) && langOptions.length) {
        const menu = langOptions.map((opt) => (
            <div
                key={opt.value}
                className={twMerge(
                    'flex items-center space-x-3.5 bg-text-color-10 text-text-color-90 px-4 py-2 text-base',
                    opt.value === currentLang
                        ? 'bg-primary-200 cursor-not-allowed text-primary-900'
                        : 'hover:bg-text-color-0 cursor-pointer'
                )}
                onClick={() => {
                    if (opt.value !== currentLang) website.changeLanguage(opt.value);
                }}>
                <span className='!text-inherit hover:!text-inherit'>{labels[opt.value] || opt.label}</span>
                {opt.value === currentLang ? <ImRadioChecked className='w-4 h-4 text-primary-700' /> : null}
            </div>
        ));

        return (
            <Popover className='relative'>
                {({ open }) => (
                    <div>
                        <Popover.Button className='w-6 h-6 flex items-center justify-center hover:scale-125 transition-all duration-300'>
                            <MdLanguage className='w-full h-full text-text-color-70 hover:text-text-color-90' />
                        </Popover.Button>
                        <Transition
                            as={Fragment}
                            show={open}
                            enter='transition ease-out duration-100'
                            enterFrom='transform opacity-0 scale-95'
                            enterTo='transform opacity-100 scale-100'
                            leave='transition ease-in duration-75'
                            leaveFrom='transform opacity-100 scale-100'
                            leaveTo='transform opacity-0 scale-95'>
                            <Popover.Panel
                                static
                                className={`absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md shadow-lg ring-1 ring-text-color-20 ring-opacity-5 focus:outline-none overflow-hidden divide-y divide-text-color-20 shadow-text-color-40`}>
                                {menu.map((opt, i) => (
                                    <div key={i}>{opt}</div>
                                ))}
                            </Popover.Panel>
                        </Transition>
                    </div>
                )}
            </Popover>
        );
    }

    return null;
}
