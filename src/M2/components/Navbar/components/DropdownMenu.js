import React, { Fragment, useRef } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { Icon, Link } from '@uniwebcms/core-components';

export default function PopoverMenu(props) {
    const { trigger, menuItems = [], openFrom = 'left', positionOffset = 1 } = props;
    const triggerRef = useRef(null);

    // Utility to determine grid columns based on item count
    const getColumnClass = (count) => {
        if (count <= 5) return 'grid-cols-1';
        if (count <= 10) return 'grid-cols-2';
        if (count <= 15) return 'grid-cols-3';
        return 'grid-cols-4';
    };

    return (
        <Popover className="relative">
            {({ open, close }) => (
                <div
                    onMouseEnter={() => {
                        triggerRef.current?.click();
                    }}
                    onMouseLeave={() => {
                        close();
                    }}
                >
                    <Popover.Button as="div" ref={triggerRef}>
                        {trigger}
                    </Popover.Button>
                    <Transition
                        as={Fragment}
                        show={open}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                    >
                        <Popover.Panel
                            className={'absolute z-50 pt-3'}
                            // style={{
                            //     [openFrom]: `calc(${-positionOffset}*20px)`,
                            // }}
                        >
                            <ul
                                className={`grid ${getColumnClass(
                                    menuItems.length
                                )} gap-1 p-2 min-w-max bg-neutral-50 rounded-md shadow-lg shadow-text-color/20`}
                            >
                                {menuItems.map((item, i) => (
                                    <li
                                        key={i}
                                        onClick={() => {
                                            close();
                                        }}
                                    >
                                        <Link
                                            to={item.route}
                                            className="p-4 text-base flex items-center gap-x-2.5 hover:bg-neutral-100 cursor-pointer min-w-52 min-h-16"
                                        >
                                            {item.icon && (
                                                <div className="p-1 rounded-md bg-neutral-950 text-neutral-50">
                                                    <Icon icon={item.icon} className="w-4 h-4" />
                                                </div>
                                            )}
                                            <span>{item.label}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </Popover.Panel>
                    </Transition>
                </div>
            )}
        </Popover>
    );
}
