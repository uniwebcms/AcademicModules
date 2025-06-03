/**
 * PopoverMenu for user selections.
 * @module PopoverMenu
 */

import React, { useState, Fragment } from 'react';
import { Transition, Popover } from '@headlessui/react';
import { twJoin } from '@uniwebcms/module-sdk';

export default function PopoverMenu(props) {
    const { renderTrigger, options, openTo = 'right', columnSize } = props;

    const [openState, setOpenState] = useState(true);

    const toggleMenu = () => {
        setOpenState((openState) => !openState);
    };

    const onHover = (action) => {
        if ((!openState && action === 'onMouseEnter') || (openState && action === 'onMouseLeave')) {
            toggleMenu();
        }
    };

    return (
        <Popover className={'relative'}>
            {({}) => (
                <div
                    onMouseEnter={() => onHover('onMouseEnter')}
                    onMouseLeave={() => onHover('onMouseLeave')}
                >
                    <Popover.Button>{renderTrigger(openState)}</Popover.Button>
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
                            className={twJoin(
                                'absolute z-50 pt-2',
                                openTo === 'right' && '-left-8',
                                openTo === 'justify' && 'left-1/2 -translate-x-1/2'
                            )}
                        >
                            <div
                                className={twJoin(
                                    'grid gap-y-6 gap-x-4 px-5 py-4 shadow-lg ring-1 ring-text-color-10 bg-bg-color rounded-md max-w-2xl xl:max-w-4xl',
                                    columnSize === 'sm' &&
                                        'grid-cols-[repeat(auto-fit,minmax(160px,1fr))]',
                                    columnSize === 'md' &&
                                        'grid-cols-[repeat(auto-fit,minmax(280px,1fr))]',
                                    columnSize === 'lg' &&
                                        'grid-cols-[repeat(auto-fit,minmax(320px,1fr))]',
                                    columnSize === 'xl' &&
                                        'grid-cols-[repeat(auto-fit,minmax(360px,1fr))]'
                                )}
                            >
                                {options}
                            </div>
                        </Popover.Panel>
                    </Transition>
                </div>
            )}
        </Popover>
    );
}
