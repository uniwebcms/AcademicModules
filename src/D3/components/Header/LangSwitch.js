import React, { Fragment } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { twJoin } from '@uniwebcms/module-sdk';
import { LuCheck, LuGlobe } from 'react-icons/lu';

export default function ({ website }) {
    const validLanguages = website.getLanguages();

    return (
        <Popover className={`relative`}>
            {({ open }) => (
                <>
                    <Popover.Button as="div" className="focus:outline-none flex-shrink-0">
                        <LuGlobe className="h-5 w-5 text-icon-color hover:text-icon-color/80 transition-colors duration-200" />
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
                            className="absolute z-50 top-full -right-5 bg-text-color-0 rounded-lg ring-1 ring-text-color/20 shadow-lg overflow-hidden w-32 py-1 text-sm font-semibold mt-4 translate-x-2"
                        >
                            <div className="flex flex-col">
                                {validLanguages.map((item) => {
                                    const { label, value } = item;
                                    const selected = website.getLanguage() === value;

                                    return (
                                        <Popover.Button key={value} as={Fragment}>
                                            <span
                                                className={twJoin(
                                                    'flex items-center cursor-pointer select-none px-2 py-1.5 bg-transparent hover:bg-text-color/10',
                                                    !selected
                                                        ? 'text-text-color/90'
                                                        : 'text-text-color'
                                                )}
                                                onClick={() => {
                                                    website.changeLanguage(value);
                                                }}
                                            >
                                                {label}
                                                {selected ? (
                                                    <LuCheck className="ml-auto h-4 w-4 text-icon-color" />
                                                ) : null}
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
