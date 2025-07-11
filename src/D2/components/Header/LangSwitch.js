import React, { Fragment } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { GrLanguage } from 'react-icons/gr';
import { twJoin } from '@uniwebcms/module-sdk';

export default function ({ website }) {
    const validLanguages = website.getLanguages();

    return (
        <Popover className={`relative`}>
            {({ open }) => (
                <>
                    <Popover.Button
                        as="div"
                        className={
                            'h-5 w-5 text-slate-500 hover:text-slate-400 dark:text-slate-400 dark:hover:text-slate-300'
                        }
                    >
                        <GrLanguage className="w-full h-full" />
                    </Popover.Button>
                    <Transition
                        as={Fragment}
                        show={open}
                        enter={`transition ease-out duration-200`}
                        enterFrom={`opacity-0 translate-y-1`}
                        enterTo={`opacity-100 translate-y-0`}
                        leave={`transition ease-in duration-150`}
                        leaveFrom={`opacity-100 translate-y-0`}
                        leaveTo={`opacity-0 translate-y-1`}
                    >
                        <Popover.Panel
                            static
                            className="absolute z-50 top-full -right-5 bg-white rounded-lg ring-1 ring-slate-900/10 shadow-lg overflow-hidden w-32 py-1 text-sm text-slate-700 font-semibold dark:bg-slate-900 dark:ring-0 dark:highlight-white/5 dark:text-slate-300 mt-4 translate-x-2"
                        >
                            <div className="flex flex-col">
                                {validLanguages.map((item) => {
                                    const { label, value } = item;
                                    const selected = website.getLanguage() === value;

                                    return (
                                        <Popover.Button key={value} as={Fragment}>
                                            <span
                                                className={twJoin(
                                                    'cursor-pointer select-none px-2.5 py-1.5',
                                                    selected
                                                        ? 'text-sky-500'
                                                        : 'text-slate-900 dark:text-slate-200 hover:bg-slate-100 hover:dark:bg-slate-700/40'
                                                )}
                                                onClick={() => {
                                                    website.changeLanguage(value);
                                                }}
                                            >
                                                {label}
                                            </span>
                                        </Popover.Button>
                                    );
                                })}
                            </div>
                        </Popover.Panel>
                    </Transition>
                </>
            )}
        </Popover>
    );
}
