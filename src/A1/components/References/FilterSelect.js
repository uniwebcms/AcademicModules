import { Listbox, Transition } from '@headlessui/react';
import { HiChevronDown, HiCheck } from 'react-icons/hi';
import { website } from '@uniwebcms/module-sdk';
import React, { Fragment, useState } from 'react';
import Styles from './sidebar.module.scss';
import { usePopper } from 'react-popper';

export default function Select({ selected, setSelected, options, label }) {
    // let selectedOption = options.find((option) => option.id === selected);

    let [referenceElement, setReferenceElement] = useState();
    let [popperElement, setPopperElement] = useState();
    let { styles, attributes } = usePopper(referenceElement, popperElement, {
        placement: 'bottom'
    });

    return (
        <Listbox value={selected} onChange={setSelected} multiple>
            <div className="relative">
                <Listbox.Button
                    ref={setReferenceElement}
                    className="relative w-full cursor-default rounded-lg bg-bg-color-30 py-1 pl-2 pr-6 text-left shadow-md focus:outline-none  focus-visible:ring-2 sm:text-sm"
                >
                    <span className="block truncate">{website.localize(label)}</span>
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
                    <Listbox.Options
                        className={`absolute z-[50] mt-1 max-h-60 w-full overflow-auto rounded-md bg-bg-color-30 py-1 text-base shadow-lg focus:outline-none sm:text-sm ${Styles.Scrollbar}`}
                        ref={setPopperElement}
                        style={styles.popper}
                        {...attributes.popper}
                    >
                        {options.map((option, optionIdx) => {
                            let isObject = typeof option === 'object';

                            let label = isObject ? option.label : option;
                            let value = isObject ? option.value : option;
                            return (
                                <Listbox.Option
                                    key={optionIdx}
                                    className={({ active }) =>
                                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                            active ? 'bg-bg-color' : 'text-text-color-90'
                                        }`
                                    }
                                    value={value}
                                >
                                    {({ selected }) => (
                                        <>
                                            <span
                                                className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}
                                            >
                                                {label}
                                            </span>
                                            {selected ? (
                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                                    <HiCheck
                                                        className="h-5 w-5 text-text-color-90"
                                                        aria-hidden="true"
                                                    />
                                                </span>
                                            ) : null}
                                        </>
                                    )}
                                </Listbox.Option>
                            );
                        })}
                    </Listbox.Options>
                </Transition>
            </div>
        </Listbox>
    );
}
