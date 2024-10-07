import React, { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { HiBars3, HiXMark } from 'react-icons/hi2';
import { Link, twMerge, Image, twJoin, getPageProfile, Icon } from '@uniwebcms/module-sdk';
import { CgChevronDown } from 'react-icons/cg';
import PopoverMenu from '../_utils/PopoverMenu';
import LanguageToggle from './LanguageToggle';
import SiteSearch from './SiteSearch';
import { getNextBlockContext } from '../_utils/context';
import './style.css';

const checkIsParentRoute = (activeRoute, current) => {
    const { child_items } = current;

    if (child_items?.length) {
        if (child_items.some((item) => item.route === activeRoute)) {
            return true;
        } else {
            return child_items.some((item) => checkIsParentRoute(activeRoute, item));
        }
    }

    return false;
};

const isActiveRoute = (activeRoute, current) => {
    return (
        activeRoute === current ||
        activeRoute === `${current}/index` ||
        activeRoute === `${current}/[id]`
    );
};

export default function PageHeader({ block, website, page }) {
    const { themeName: theme, main } = block;
    const { mode = 'auto', sticky = false, alignment = 'left' } = block.getBlockProperties();

    const nextBlockContext = getNextBlockContext(block);

    const { theme: nextTheme = '', allowTranslucentTop = false } = nextBlockContext;

    const pages = website.getPageHierarchy({
        nested: true,
        filterEmpty: true,
    });

    const blockLinks = block.getBlockLinks({ nested: true });

    let navigation = [];

    if (mode == 'auto') {
        if (blockLinks.length) {
            navigation = blockLinks;
        } else {
            navigation = pages;
        }
    } else if (mode == 'manual') {
        navigation = blockLinks;
    } else if (mode == 'page') {
        navigation = pages;
    }

    const [initialPosition, setInitialPosition] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const left_aligned = alignment == 'left';

    const activeRoute = page.activeRoute;
    const banner = main?.banner;
    const firstIcon = main?.body?.icons?.[0];
    const images = [];

    window.onscroll = function () {
        if (window.scrollY > 0 && initialPosition) {
            setInitialPosition(false);
        } else if (window.scrollY == 0 && !initialPosition) {
            setInitialPosition(true);
        }
    };

    useEffect(() => {
        setMobileMenuOpen(false);
    }, [activeRoute]);

    const wrapperClass = ['flex max-w-full w-screen'];

    let adaptiveTheme = theme;

    if (allowTranslucentTop) {
        if (initialPosition || !sticky) {
            wrapperClass.push('absolute top-0 left-0 z-50 !bg-[unset]');
        }

        if (!nextTheme) {
            adaptiveTheme = theme;
        } else {
            adaptiveTheme = `${nextTheme}`;
        }
    }

    wrapperClass.push(adaptiveTheme);

    if (sticky && !initialPosition) {
        wrapperClass.push('fixed top-0 left-0 z-50 bg-bg-color');
    }

    if (!left_aligned) {
        wrapperClass.push('justify-center');
    }

    if (main?.body?.imgs?.length) {
        images.push(...main?.body?.imgs);
    }

    if (banner) {
        images.unshift(banner);
    }

    let logo = null;

    if (firstIcon) {
        logo = <Icon icon={firstIcon} className="w-full h-full" />;
    } else {
        if (images.length) {
            let logoImg = images.find((img) => {
                const theme = adaptiveTheme.split('__')[1];

                return img.caption === `logo-${theme}`;
            });

            if (!logoImg) {
                logoImg = images[0];
            }

            logo = (
                <Image
                    profile={getPageProfile()}
                    url={logoImg.url}
                    value={logoImg.value}
                    alt={logoImg.alt}
                    className="w-full h-full object-contain"
                />
            );
        }
    }

    return (
        <div className={twMerge(wrapperClass, !initialPosition && sticky && '!shadow-2xl')}>
            <div
                className={twMerge(
                    'transition-transform duration-300 flex items-center w-full lg:px-12 px-6 py-3 justify-between lg:justify-normal max-w-10xl mx-auto'
                )}
            >
                {logo ? (
                    <Link
                        to=""
                        title="A link back to the site's homepage"
                        className="w-fit max-w-[8rem] flex-shrink-0"
                    >
                        <div className="h-[32px] md:h-[36px] lg:h-[44px] w-auto max-w-full">
                            {logo}
                        </div>
                    </Link>
                ) : null}
                <nav
                    className={twJoin(
                        'hidden lg:flex 2xl:space-x-10 xl:space-x-8 lg:space-x-6 items-center w-full sm:h-10',
                        left_aligned ? 'justify-start xl:ml-16 lg:ml-10' : 'justify-center'
                    )}
                >
                    {navigation.map((page, index) => {
                        if (page.child_items?.length) {
                            return (
                                <NavbarMenu
                                    key={index}
                                    {...page}
                                    activeRoute={activeRoute}
                                    theme={adaptiveTheme}
                                />
                            );
                        } else {
                            const { route, label } = page;
                            const active = isActiveRoute(activeRoute, route);

                            return (
                                <Link
                                    key={index}
                                    to={route}
                                    className={twJoin(
                                        'inline-block text-base md:text-lg font-semibold px-3 py-2 truncate',
                                        active
                                            ? 'text-link-color'
                                            : 'text-text-color hover:scale-125 transition-transform duration-300'
                                    )}
                                >
                                    {label}
                                </Link>
                            );
                        }
                    })}
                </nav>
                <div className="flex items-center space-x-6 w-44 lg:w-32 justify-end">
                    <SiteSearch />
                    <LanguageToggle />
                    <button
                        type="button"
                        className="rounded-md p-2.5 lg:hidden"
                        onClick={() => setMobileMenuOpen(true)}
                    >
                        <span className="sr-only">Open main menu</span>
                        <HiBars3
                            className="w-6 h-6 text-text-color-70 hover:text-text-color-90"
                            aria-hidden="true"
                        />
                    </button>
                </div>
                <Dialog
                    as="div"
                    open={mobileMenuOpen}
                    onClose={setMobileMenuOpen}
                    className={adaptiveTheme}
                >
                    <Dialog.Panel className="fixed inset-0 z-50 px-6 py-3 overflow-y-auto lg:hidden bg-bg-color">
                        <div className="flex flex-row-reverse items-center justify-between">
                            <button
                                type="button"
                                className="inline-flex items-center justify-center rounded-md p-2.5"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <span className="sr-only">Close menu</span>
                                <HiXMark
                                    className="w-6 h-6 text-text-color-70 hover:text-text-color-90"
                                    aria-hidden="true"
                                />
                            </button>
                            <a href="#" className="p-1.5 -ml-1.5">
                                <span className="sr-only">Your Company</span>
                                <div className="h-8 w-auto max-w-full">
                                    {logo && <div className="w-full h-full">{logo}</div>}
                                </div>
                            </a>
                        </div>
                        <div className="mt-6 space-y-5">
                            {navigation.map((page, index) => {
                                if (page.child_items?.length) {
                                    return (
                                        <MobileNavbarMenu
                                            key={index}
                                            {...page}
                                            activeRoute={activeRoute}
                                        />
                                    );
                                } else {
                                    const { route, label } = page;
                                    const active = isActiveRoute(activeRoute, route);

                                    return (
                                        <Link
                                            key={index}
                                            to={route}
                                            className={twMerge(
                                                'mr-2 inline-block px-3 py-2 text-xl font-semibold leading-7 text-text-color-90 hover:text-text-color',
                                                active && 'text-link-color'
                                            )}
                                        >
                                            {label}
                                        </Link>
                                    );
                                }
                            })}
                        </div>
                    </Dialog.Panel>
                </Dialog>
            </div>
        </div>
    );
}

const MobileNavbarMenu = ({ label, route, child_items, hasData, activeRoute }) => {
    const active = isActiveRoute(activeRoute, route);

    return (
        <div>
            {hasData ? (
                <Link
                    to={route}
                    className={twMerge(
                        'block px-3 py-2 text-xl font-semibold leading-7 text-text-color-90 hover:text-text-color w-fit',
                        active && 'text-link-color'
                    )}
                >
                    {label}
                </Link>
            ) : (
                <p
                    className={twMerge(
                        'px-3 py-2 text-xl font-semibold leading-7 text-text-color-70'
                    )}
                >
                    {label}
                </p>
            )}
            <div className="px-3 mt-1 grid grid-cols-2 md:grid-cols-2 gap-2">
                {child_items.map((item, index) => {
                    const { route, label, child_items, hasData } = item;
                    const active = isActiveRoute(activeRoute, route);

                    return (
                        <div key={index} className={twJoin('')}>
                            {hasData ? (
                                <Link
                                    key={index}
                                    to={route}
                                    className={twMerge(
                                        'block text-lg font-medium leading-7 text-text-color-90 hover:text-text-color w-fit',
                                        active && 'text-link-color'
                                    )}
                                >
                                    {label}
                                </Link>
                            ) : (
                                <p className="block text-lg font-medium leading-7 text-text-color-70">
                                    {label}
                                </p>
                            )}
                            {child_items?.length ? (
                                <ul className="list-disc list-inside">
                                    {child_items.map((item, index) => {
                                        const { route, label } = item;
                                        const active = isActiveRoute(activeRoute, route);

                                        return (
                                            <Link
                                                key={index}
                                                to={route}
                                                className={twMerge(
                                                    'list-item px-3 text-base font-semibold leading-7 text-text-color-90 hover:text-text-color w-fit',
                                                    active && 'text-link-color'
                                                )}
                                            >
                                                {label}
                                            </Link>
                                        );
                                    })}
                                </ul>
                            ) : null}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const buildNavigationMenu = (items, level, activeRoute) => {
    return items.map((item, index) => {
        const { route, label, child_items, hasData } = item;

        const isFirst = index === 0;
        const isLast = index === items.length - 1;

        const active = isActiveRoute(activeRoute, route);
        const isParentRoute = checkIsParentRoute(activeRoute, { child_items });

        return (
            <div
                key={index}
                className={twJoin(
                    'bg-text-color-0 hover:bg-text-color-10 relative group w-60 lg:w-72 xl:w-80',
                    isFirst && 'rounded-t-md',
                    isLast && 'rounded-b-md'
                )}
            >
                {hasData ? (
                    <Link
                        key={index}
                        to={route}
                        className={twMerge(
                            'block w-full h-full px-6 py-4 text-base font-medium lg:text-[17px] text-text-color-90 hover:text-text-color',
                            active ? 'text-link-color' : '',
                            isParentRoute && 'underline decoration-link-color'
                        )}
                    >
                        {label}
                    </Link>
                ) : (
                    <p
                        className="w-full h-full px-6 py-4 text-base font-medium lg:text-[17px] text-text-color-70"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}
                    >
                        {label}
                    </p>
                )}
                {child_items?.length ? (
                    <div
                        className="absolute -top-1 left-[230px] lg:left-[280px] rounded-md shadow ring-1 ring-text-color-20 ring-opacity-10 divide-y divide-text-color-20 invisible group-hover:visible"
                        style={{ zIndex: level }}
                        onClick={(e) => {
                            e.stopPropagation;
                        }}
                    >
                        {buildNavigationMenu(child_items, level + 10, activeRoute)}
                    </div>
                ) : null}
            </div>
        );
    });
};

const NavbarMenu = ({ label, route, child_items, hasData, activeRoute, theme }) => {
    const active = isActiveRoute(activeRoute, route);

    const isParentRoute = checkIsParentRoute(activeRoute, { child_items });

    const trigger = hasData ? (
        <Link
            to={route}
            className={twMerge(
                'flex items-center space-x-1 hover:scale-125 transition-transform duration-300 text-text-color-90 hover:text-text-color',
                isParentRoute && 'pl-1 border-b-2 border-link-color',
                active && 'text-link-color'
            )}
        >
            <p>{label}</p>
            <CgChevronDown className="w-5 h-5 text-inherit" />
        </Link>
    ) : (
        <div
            className={twMerge(
                'flex items-center space-x-1 text-text-color-90',
                isParentRoute && 'pl-1 border-b-2 border-link-color',
                active && 'text-link-color'
            )}
        >
            <p>{label}</p>
            <CgChevronDown className="w-5 h-5 text-inherit" />
        </div>
    );

    return (
        <PopoverMenu
            trigger={trigger}
            triggerClassName={`inline-flex items-center text-base md:text-lg font-semibold focus:outline-none px-3 py-2 z-50${
                !hasData && 'cursor-default'
            }`}
            options={buildNavigationMenu(child_items, 10, activeRoute)}
        />
    );
};
