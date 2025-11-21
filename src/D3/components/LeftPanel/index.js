import React, { useCallback, useState } from 'react';
import { twJoin } from '@uniwebcms/module-sdk';
import { Link } from '@uniwebcms/core-components';
import { LuPlus, LuChevronDown, LuMinus } from 'react-icons/lu';
import { TbBorderCornerIos } from 'react-icons/tb';

const registerOpenState = (navigation, state) => {
    navigation.forEach((page) => {
        if (page.child_items && page.child_items.length > 0) {
            state[page.id] = true;
            registerOpenState(page.child_items, state);
        }
    });
};

export default function LeftPanel(props) {
    const {
        block,
        website,
        page: { activeRoute },
        extra,
    } = props;

    const headerSiteNavigation = extra?.headerSiteNavigation || false;
    const firstSegment = activeRoute.split('/')[0];

    const pages = website.getPageHierarchy();

    const {
        collapsible = 'no',
        hierarchy_indicator = 'none',
        navigation_style = 'link_like',
        auto_collapse = 'no',
        initial_state = 'close_all',
    } = block.getBlockProperties();

    let navigation = pages;

    // conditionally filter navigation based on the first segment and root level navigation state
    if (headerSiteNavigation) {
        const match = pages.find((p) => p.route === firstSegment);

        if (match) {
            navigation = !match.hasData && match.child_items?.length ? match.child_items : [match];
        }
    }

    const [openState, setOpenState] = useState(() => {
        const state = {};
        // Only open all if 'open_all' is explicitly set
        if (initial_state === 'open_all') {
            registerOpenState(navigation, state);
        }
        // Otherwise, return an empty state (all closed)
        return state;
    });

    // Update toggleOpen to handle accordion logic
    const toggleOpen = useCallback(
        (id, siblingIds) => {
            setOpenState((prev) => {
                const newState = { ...prev };
                const isOpening = !prev[id]; // Check if we're about to open this item

                // If auto_collapse is on, and we are opening an item, close all siblings
                if (auto_collapse === 'yes' && isOpening && siblingIds) {
                    siblingIds.forEach((siblingId) => {
                        if (siblingId !== id) {
                            newState[siblingId] = false;
                        }
                    });
                }

                // Toggle the clicked item
                newState[id] = isOpening;

                return newState;
            });
        },
        [auto_collapse]
    );

    return (
        <div className="relative h-full">
            <div className="bg-text-color-0 md:bg-bg-color md:ml-auto h-full w-full md:w-64 overflow-y-auto overflow-x-hidden py-6 md:py-8 pr-8 pl-6 md:pl-1">
                <nav className="text-base md:text-sm lg:text-base xl:text-base">
                    <Navigation
                        navigation={navigation}
                        activeRoute={activeRoute}
                        collapsible={collapsible}
                        openState={openState}
                        toggleNavOpen={toggleOpen}
                        hierarchyIndicator={hierarchy_indicator}
                        navigationStyle={navigation_style}
                    />
                </nav>
            </div>
        </div>
    );
}

const Navigation = ({
    navigation,
    activeRoute,
    collapsible,
    openState,
    toggleNavOpen,
    hierarchyIndicator,
    navigationStyle,
    level = 0,
}) => {
    const isActive = (page) => page.route === activeRoute;

    const isRoot = level === 0;

    const containerClass = [
        isRoot
            ? navigationStyle === 'button_like'
                ? 'space-y-4' // Smaller gap for root buttons
                : 'space-y-6' // Original gap for root links
            : navigationStyle === 'button_like'
            ? 'mt-1 space-y-2 lg:mt-3 lg:space-y-3' // Smaller gap for nested buttons
            : 'mt-2 space-y-2 lg:mt-3 lg:space-y-4', // Original gap for nested links
        hierarchyIndicator === 'line' && !isRoot ? 'border-l-2 border-text-color/20' : '',
        level > 1 ? 'ml-5' : 'ml-1',
    ].filter(Boolean);

    return (
        <ul role="list" className={twJoin(containerClass)}>
            {navigation.map((page) => {
                const hasChildren = page.child_items?.length > 0;
                const showChildren = (hasChildren && openState[page.id]) || collapsible === 'no';

                // 1. Classes for the <li> wrapper <div>
                const itemWrapperClasses = ['relative flex items-center justify-between'];

                if (!isRoot) {
                    // Handle indentation for nested items
                    if (navigationStyle === 'button_like') {
                        itemWrapperClasses.push(hierarchyIndicator !== 'none' ? 'ml-5' : 'ml-1');
                    } else {
                        itemWrapperClasses.push('ml-3.5');
                    }
                }

                if (navigationStyle === 'button_like') {
                    itemWrapperClasses.push('px-2 py-1 rounded-[var(--border-radius)]');

                    // Handle button-like active/inactive/hover states
                    if (isActive(page)) {
                        itemWrapperClasses.push(
                            'bg-btn-hover-color [&_a]:!text-btn-hover-text-color [&_button_svg]:!text-btn-hover-text-color'
                        );
                    } else if (!isRoot) {
                        // Inactive, non-root button
                        itemWrapperClasses.push(
                            'bg-btn-color [&_a]:!text-btn-text-color hover:bg-btn-hover-color [&_a]:hover:!text-btn-hover-text-color [&_button_svg]:hover:!text-btn-hover-text-color'
                        );
                    } else if (isRoot && page.hasData) {
                        // Inactive, root, and has a link (so it can be hovered)
                        itemWrapperClasses.push(
                            'hover:bg-btn-hover-color [&_a]:hover:!text-btn-hover-text-color [&_button_svg]:hover:!text-btn-hover-text-color'
                        );
                    }
                }

                // 3. Classes for the hover-dot (if applicable)
                if (page.hasData && hierarchyIndicator === 'line' && !isRoot) {
                    itemWrapperClasses.push(
                        'before:pointer-events-none before:absolute before:bg-text-color-40',
                        'before:top-1/2 before:-translate-y-1/2', // Vertical centering
                        'before:h-1.5 before:w-1.5 before:rounded-full',
                        'before:opacity-0 hover:before:opacity-100 before:transition-opacity',
                        // Horizontal positioning based on style
                        navigationStyle === 'button_like'
                            ? 'before:-left-[24px]'
                            : 'before:-left-[1.1rem]'
                    );
                }

                // 2. Classes for the <p> or <Link> label
                const labelClasses = [];

                if (isRoot) {
                    labelClasses.push('font-semibold');
                }

                if (page.hasData) {
                    // This is a clickable link
                    if (isActive(page)) {
                        labelClasses.push('text-link-active-color');
                        if (!isRoot) {
                            // Active, non-root links are also medium weight
                            labelClasses.push('font-medium');
                        }
                    } else {
                        // Inactive link
                        labelClasses.push('text-text-color hover:text-link-hover-color');
                        if (!isRoot) {
                            labelClasses.push('hover:[text-shadow:0.5px_0_0_currentColor]');
                        }
                        if (navigationStyle === 'button_like') {
                            labelClasses.push('block');
                        }
                    }
                } else {
                    // This is just a text label
                    labelClasses.push('text-text-color');
                }

                return (
                    <li key={page.id} className={twJoin(!isRoot && 'relative')}>
                        <div className={twJoin(itemWrapperClasses)}>
                            <div className={navigationStyle === 'button_like' ? 'flex-grow' : ''}>
                                {page.hasData ? (
                                    <Link to={page.route} className={twJoin(labelClasses)}>
                                        {page.label}
                                    </Link>
                                ) : (
                                    <p className={twJoin(labelClasses)}>{page.label}</p>
                                )}
                            </div>
                            {hierarchyIndicator === 'thread' && !isRoot ? (
                                <div className="absolute top-[0px] -left-[18px]">
                                    <TbBorderCornerIos className="w-4 h-4 -rotate-90 text-text-color/60" />
                                </div>
                            ) : null}
                            {collapsible !== 'no' && hasChildren ? (
                                <button
                                    className="ml-2 focus:outline-none bg-transparent"
                                    // Update onClick to pass sibling IDs
                                    onClick={() => {
                                        const siblingIds = navigation.map((p) => p.id);
                                        toggleNavOpen(page.id, siblingIds);
                                    }}
                                >
                                    {collapsible === 'arrows' && (
                                        <LuChevronDown
                                            className={twJoin(
                                                'h-5 w-5 text-text-color/70 hover:text-text-color',
                                                !openState[page.id] ? '-rotate-90' : ''
                                            )}
                                        />
                                    )}
                                    {collapsible === 'plus_minus' &&
                                        (openState[page.id] ? (
                                            <LuMinus className="h-5 w-5 text-text-color/70 hover:text-text-color" />
                                        ) : (
                                            <LuPlus className="h-5 w-5 text-text-color/70 hover:text-text-color" />
                                        ))}
                                </button>
                            ) : null}
                        </div>
                        {showChildren ? (
                            <Navigation
                                navigation={page.child_items}
                                activeRoute={activeRoute}
                                level={level + 1}
                                collapsible={collapsible}
                                openState={openState}
                                toggleNavOpen={toggleNavOpen}
                                hierarchyIndicator={hierarchyIndicator}
                                navigationStyle={navigationStyle}
                            />
                        ) : null}
                    </li>
                );
            })}
        </ul>
    );
};
