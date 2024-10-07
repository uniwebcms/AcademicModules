import { Listbox, Transition } from '@headlessui/react';
import { HiChevronDown } from 'react-icons/hi';
import React, { Fragment } from 'react';

export default function CitationStyles({ selected, setSelected, options }) {
    let selectedOption = options.find((option) => option.id === selected);
    return (
        <Listbox value={selected} onChange={setSelected}>
            <div className="relative ml-2">
                <Listbox.Button className="relative w-28 cursor-default rounded-lg bg-bg-color-30 py-1 pl-2 pr-6 text-left shadow-md focus:outline-none  focus-visible:ring-2 sm:text-sm">
                    <span className="block truncate">{selectedOption.name}</span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <HiChevronDown className="h-4 w-4 text-text-color-90" aria-hidden="true" />
                    </span>
                </Listbox.Button>
                <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-bg-color-30 py-1 text-base shadow-lg focus:outline-none sm:text-sm">
                        {options.map((option, optionIdx) => (
                            <Listbox.Option
                                key={optionIdx}
                                className={({ active }) =>
                                    `relative cursor-default select-none py-2 px-3 ${
                                        active ? 'bg-bg-color' : 'text-text-color-90'
                                    }`
                                }
                                value={option.id}
                            >
                                {({ selected }) => (
                                    <>
                                        <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                            {option.name}
                                        </span>
                                    </>
                                )}
                            </Listbox.Option>
                        ))}
                    </Listbox.Options>
                </Transition>
            </div>
        </Listbox>
    );
}
