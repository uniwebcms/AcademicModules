/**
 * PopoverMenu for user selections.
 * @module PopoverMenu
 */

import React, { useState, useRef, Fragment } from 'react';
import { Transition, Popover } from '@headlessui/react';
import { twMerge } from '@uniwebcms/module-sdk';

/**
//  * Example implementation to use Popper: https://popper.js.org/
//  */
// export function usePopper(options) {
//     let reference = useRef(null);
//     let popper = useRef(null);

//     let cleanupCallback = useRef(() => {});

//     let instantiatePopper = useCallback(() => {
//         if (!reference.current) return;
//         if (!popper.current) return;

//         if (cleanupCallback.current) cleanupCallback.current();

//         cleanupCallback.current = createPopper(reference.current, popper.current, options).destroy;
//     }, [reference, popper, cleanupCallback, options]);

//     return useMemo(
//         () => [
//             (referenceDomNode) => {
//                 reference.current = referenceDomNode;
//                 instantiatePopper();
//             },
//             (popperDomNode) => {
//                 popper.current = popperDomNode;
//                 instantiatePopper();
//             }
//         ],
//         [reference, popper, instantiatePopper]
//     );
// }

// export function Portal(props) {
//     let { children } = props;
//     let [mounted, setMounted] = useState(false);

//     useEffect(() => setMounted(true), []);

//     if (!mounted) return null;
//     return createPortal(children, document.body);
// }

/**
 * Render a menu with options to be selected by the user.
 *
 * @example
 * function MyComponent() {
 *   const options = [<div>Option 1</div>, <div>Option 2</div>, <div>Option 2</div>];
 *
 *    return (
 *       <PopoverMenu
 *          trigger={<div>Open Menu</div>}
 *          options={options}
 *          triggerClassName='px-2 py-1 text-blue-600 text-sm border rounded'
 *          position='top-0 left-4'
 *          width='120px'
 *          zIndex='10' />
 *    );
 * }
 * https://codesandbox.io/s/hover-popover-flyout-menu-using-headless-ui-and-tailwindcss-with-react-live-demo-by-doctorderek-forked-p4wjtc?file=/src/App.js:2544-2725
 * @component PopoverMenu
 * @param {ReactElement} trigger - The Trigger element
 * @param {string} triggerClassName - The class name that apply to the trigger element
 * @param {CSSStyleRule} triggerStyle - The style that apply to the trigger element
 * @param {ReactElement[]} options - The option elements in the dropdown menu
 * @param {string} menuClassName - The class name that apply to the menu element
 * @param {string} width - The menu width
 * @param {number} zIndex - The zIndex value of the menu
 * @param {string} position - The position of the menu relative to the trigger
 * @returns {function} A React component.
 */
export default function PopoverMenu(props) {
    const { trigger, options, triggerClassName = '' } = props;

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
                                `absolute -left-5 rounded-md shadow shadow-text-color-40 ring-1 ring-text-color-20 ring-opacity-10 divide-y divide-text-color-20 z-10`
                            )}
                        >
                            {options.map((opt, i) => (
                                <div
                                    key={i}
                                    onClick={() => {
                                        setOpenState(false);
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

/////////////////////////// old code
/**
 * 
 * export default function PopoverMenu(props) {
    const { trigger, onTriggerClick, options, triggerClassName = '', menuClassName = '' } = props;

    const buttonRef = useRef(null);
    const [openState, setOpenState] = useState(false);

    const toggleMenu = (open) => {
        setOpenState((openState) => !openState);

        buttonRef?.current?.click();
    };

    const onHover = (open, action) => {
        if ((!open && !openState && action === 'onMouseEnter') || (open && openState && action === 'onMouseLeave')) {
            toggleMenu(open);
        }
    };

    const handleClick = (open) => {
        setOpenState(!open);
    };

    return (
        <Popover className='relative'>
            {({ open }) => (
                <div
                    onMouseEnter={() => onHover(open, 'onMouseEnter')}
                    onMouseLeave={() => onHover(open, 'onMouseLeave')}>
                    <Popover.Button
                        className={`${triggerClassName}`}
                        ref={buttonRef}
                        onClick={() => onTriggerClick ?? handleClick(open)}>
                        {trigger}
                    </Popover.Button>
                    <Transition
                        as={Fragment}
                        show={open}
                        enter='transition ease-out duration-200'
                        enterFrom='opacity-0 translate-y-1'
                        enterTo='opacity-100 translate-y-0'
                        leave='transition ease-in duration-150'
                        leaveFrom='opacity-100 translate-y-0'
                        leaveTo='opacity-0 translate-y-1'>
                        <Popover.Panel
                            static
                            className={`absolute -left-5 bg-neutral-200 rounded-md !shadow-xl ring-1 ring-neutral-400 ring-opacity-10 divide-y divide-neutral-600 z-10`}>
                            {({ close }) =>
                                options.map((opt, i) => (
                                    <div
                                        key={i}
                                        onClick={() => {
                                            setOpenState(false);
                                            close();
                                        }}>
                                        {opt}
                                    </div>
                                ))
                            }
                        </Popover.Panel>
                    </Transition>
                </div>
            )}
        </Popover>
    );
}

 * 
 */
