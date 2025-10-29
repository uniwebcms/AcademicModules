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
    } = props;
    const pages = website.getPageHierarchy();

    const {
        collapsible = 'no',
        hierarchy_indicator = 'none',
        navigation_style = 'link_like',
    } = block.getBlockProperties();

    const [openState, setOpenState] = useState(() => {
        const state = {};
        registerOpenState(pages, state);
        return state;
    });

    const toggleOpen = useCallback((id) => {
        setOpenState((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    }, []);

    return (
        <div className="relative">
            <div className="md:ml-auto h-[calc(100vh-64px)] w-full md:w-64 overflow-y-auto overflow-x-hidden py-6 md:py-8 pr-8 pl-1">
                <nav className="text-base md:text-sm lg:text-base xl:text-base">
                    <Navigation
                        navigation={pages}
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
        level === 0 ? 'space-y-9' : 'mt-2 space-y-2 lg:mt-4 lg:space-y-4',
        hierarchyIndicator === 'line' && level > 0 ? 'border-l-2 border-text-color/20' : '',
        level > 1 ? 'ml-5' : 'ml-1',
    ].filter(Boolean);

    return (
        <ul role="list" className={twJoin(containerClass)}>
            {navigation.map((page) => {
                const hasChildren = page.child_items?.length > 0;
                const showChildren = (hasChildren && openState[page.id]) || collapsible === 'no';

                const labelClass = [];

                if (level === 0) {
                    labelClass.push('font-semibold');

                    if (page.hasData) {
                        if (isActive(page)) {
                            labelClass.push('text-link-hover-color');
                        } else {
                            labelClass.push('text-text-color hover:text-link-hover-color');
                            if (navigationStyle === 'button_like') {
                                labelClass.push('block');
                            }
                        }
                    } else {
                        labelClass.push('text-text-color');
                    }
                } else {
                    if (page.hasData) {
                        if (isActive(page)) {
                            labelClass.push('font-medium text-link-hover-color');
                        } else {
                            labelClass.push(
                                'text-text-color hover:text-link-hover-color hover:[text-shadow:0.5px_0_0_currentColor]'
                            );
                            if (navigationStyle === 'button_like') {
                                labelClass.push('block');
                            }
                        }
                    } else {
                        labelClass.push('text-text-color');
                    }
                }

                return (
                    <li key={page.id} className={twJoin(!isRoot && 'relative')}>
                        <div
                            className={twJoin(
                                'relative flex items-center justify-between',
                                navigationStyle === 'button_like' && 'px-2 py-1 rounded-r-lg',
                                navigationStyle === 'button_like' && !isRoot
                                    ? isActive(page)
                                        ? 'bg-btn-hover-color [&_a]:!text-btn-hover-text-color [&_button_svg]:!text-btn-hover-text-color'
                                        : 'bg-btn-color [&_a]:!text-btn-text-color hover:bg-btn-hover-color [&_a]:hover:!text-btn-hover-text-color [&_button_svg]:hover:!text-btn-hover-text-color'
                                    : '',
                                navigationStyle === 'button_like' && isRoot && page.hasData
                                    ? isActive(page)
                                        ? 'bg-btn-hover-color [&_a]:!text-btn-hover-text-color [&_button_svg]:!text-btn-hover-text-color'
                                        : 'hover:bg-btn-hover-color [&_a]:hover:!text-btn-hover-text-color [&_button_svg]:hover:!text-btn-hover-text-color'
                                    : '',
                                !isRoot
                                    ? navigationStyle === 'button_like'
                                        ? hierarchyIndicator !== 'none'
                                            ? 'ml-5'
                                            : 'ml-1'
                                        : 'ml-3.5'
                                    : ''
                            )}
                        >
                            <div className={navigationStyle === 'button_like' ? 'flex-grow' : ''}>
                                {page.hasData ? (
                                    <Link to={page.route} className={twJoin(labelClass)}>
                                        {page.label}
                                    </Link>
                                ) : (
                                    <p className={twJoin(labelClass)}>{page.label}</p>
                                )}
                            </div>
                            {hierarchyIndicator === 'thread' && level > 0 ? (
                                <div className="absolute top-[0px] -left-[18px]">
                                    <TbBorderCornerIos className="w-4 h-4 -rotate-90 text-text-color/60" />
                                </div>
                            ) : null}
                            {collapsible !== 'no' && hasChildren ? (
                                <button
                                    className="ml-2 focus:outline-none bg-transparent"
                                    onClick={() => toggleNavOpen(page.id)}
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
