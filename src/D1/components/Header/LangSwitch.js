import React, { Fragment } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { HiGlobeAlt } from 'react-icons/hi';

export default function ({ website, activeLang }) {
    const validLanguages = website.getLanguages();

    let btnStyle = `w-8 h-8 p-1 outline-none rounded-md flex items-center justify-center group rounded-md text-neutral-500 hover:bg-primary-100 hover:text-primary-500 cursor-pointer`;

    return (
        <Popover className={`relative`}>
            {({ open }) => (
                <>
                    <Popover.Button as="div" className={btnStyle}>
                        <HiGlobeAlt className={`w-6 h-6`} />
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
                            className={`absolute z-[999] top-full left-1/2 -translate-x-1/2 w-32 mt-1 bg-white rounded-lg shadow-md border ring-1 ring-neutral-900 ring-opacity-5 font-normal text-sm divide-y divide-neutral-100`}
                        >
                            <div className={`py-1.5 flex flex-col`}>
                                {validLanguages.map((item) => {
                                    const { label, value } = item;
                                    return (
                                        <Popover.Button key={value} as={Fragment}>
                                            <span
                                                className={`px-3.5 py-1.5 text-neutral-900
                                                    ${
                                                        activeLang === value
                                                            ? 'cursor-not-allowed bg-neutral-100'
                                                            : 'cursor-pointer hover:text-primary-500'
                                                    }
                                                    `}
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
