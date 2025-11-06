import React, { useState, useRef, Fragment } from 'react';
import { Transition, Popover } from '@headlessui/react';
import { twMerge } from '@uniwebcms/module-sdk';

export default function PopoverMenu(props) {
    const { trigger, options, triggerClassName = '', menuClassName = '', autoClose = true } = props;

    const buttonRef = useRef(null);
    const [openState, setOpenState] = useState(false);

    const toggleMenu = () => {
        setOpenState((openState) => !openState);
    };

    const onHover = (action) => {
        if ((!openState && action === 'onMouseEnter') || (openState && action === 'onMouseLeave')) {
            toggleMenu();
        }
    };

    const handleClick = (open) => {
        if (!openState) toggleMenu();
    };

    return (
        <Popover className={'relative'}>
            {({ open }) => (
                <div
                    onMouseEnter={() => onHover('onMouseEnter')}
                    onMouseLeave={() => onHover('onMouseLeave')}
                >
                    <Popover.Button
                        as="div"
                        className={`${triggerClassName}`}
                        ref={buttonRef}
                        onClick={() => handleClick(open)}
                    >
                        {trigger}
                    </Popover.Button>
                    <Transition
                        as={Fragment}
                        show={openState}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                    >
                        <Popover.Panel
                            static
                            className={twMerge(
                                `absolute right-0 border-[length:var(--depth-style-outline)] rounded-[var(--border-radius)] [box-shadow:var(--depth-style-shadow)] border-text-color/20 divide-y divide-text-color-20 z-50 overflow-hidden`,
                                menuClassName
                            )}
                        >
                            {options.map((opt, i) => (
                                <div
                                    key={i}
                                    onClick={() => {
                                        if (autoClose) setOpenState(false);
                                    }}
                                >
                                    {opt}
                                </div>
                            ))}
                        </Popover.Panel>
                    </Transition>
                </div>
            )}
        </Popover>
    );
}
