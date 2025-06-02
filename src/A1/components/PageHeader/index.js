import React, { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { HiBars3, HiXMark } from 'react-icons/hi2';
import { twMerge, twJoin, getPageProfile } from '@uniwebcms/module-sdk';
import { Link, Image, Icon } from '@uniwebcms/core-components';
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
    const {
        mode = 'auto',
        sticky = false,
        alignment = 'left',
        logo_position = 'left',
    } = block.getBlockProperties();

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
    const logoAriaLabel = website.localize({
        en: 'Go to homepage',
        fr: 'Aller à la page d’accueil',
    });

    if (firstIcon) {
        logo = (
            <Link to="" ariaLabel={logoAriaLabel}>
                {/* <div className="h-[32px] md:h-[36px] lg:h-[44px] w-auto max-w-full"> */}
                <Icon icon={firstIcon} className="h-10 w-auto max-w-full" />
                {/* </div> */}
            </Link>
        );
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
                <Link to="" ariaLabel={logoAriaLabel}>
                    <Image
                        profile={getPageProfile()}
                        url={logoImg.url}
                        value={logoImg.value}
                        alt={logoImg.alt}
                        className={twJoin(
                            'w-auto max-w-full object-contain',
                            logo_position === 'center' ? 'h-10 lg:h-14' : 'h-10'
                        )}
                    />
                </Link>
            );
        }
    }

    return (
        <div className={twMerge(wrapperClass, !initialPosition && sticky && '!shadow-2xl')}>
            <div
                className={twMerge(
                    'relative transition-transform duration-300 flex items-center w-full lg:px-12 px-6 py-3 justify-between lg:justify-normal max-w-10xl mx-auto',
                    logo_position === 'center' && 'pt-3 lg:pt-[70px]'
                )}
            >
                <div
                    className={twJoin(
                        'w-32 lg:w-28 flex-shrink-0',
                        logo_position === 'center' &&
                            'lg:block lg:w-auto lg:absolute lg:top-2.5 lg:left-1/2 lg:-translate-x-1/2'
                    )}
                >
                    {logo}
                </div>
                <nav
                    className={twJoin(
                        'hidden lg:flex items-center w-full sm:h-10 [&>*]:lg:mx-2 [&>*]:xl:mx-3 [&>*]:2xl:mx-4',
                        left_aligned ? 'justify-start' : 'justify-center',
                        !left_aligned && logo_position === 'center' ? 'ml-0 lg:ml-32' : ''
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
                                        'inline-block lg:text-base xl:text-lg font-semibold px-2 py-2 truncate',
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
                <div className="flex-shrink-0 flex items-center gap-x-4 w-32 lg:w-28 justify-end">
                    <SiteSearch />
                    <LanguageToggle />
                    <button
                        type="button"
                        className="rounded-md py-2 lg:hidden"
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
                                className="inline-flex items-center justify-center rounded-md py-2"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <span className="sr-only">Close menu</span>
                                <HiXMark
                                    className="w-6 h-6 text-text-color-70 hover:text-text-color-90"
                                    aria-hidden="true"
                                />
                            </button>
                            {logo}
                        </div>
                        <div className="mt-6 space-y-3">
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
                                                'mr-5 inline-block py-2 text-lg font-medium text-text-color',
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
                        'block py-2 text-lg font-medium leading-7 text-text-color-90',
                        active && 'text-link-color'
                    )}
                >
                    {label}
                </Link>
            ) : (
                <p className="py-2 text-lg font-medium text-text-color-70">{label}</p>
            )}
            <div className="px-3 mt-1 mb-2 flex flex-col space-y-2 border-l-2">
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
                                        'block text-base text-text-color',
                                        active && 'text-link-color'
                                    )}
                                >
                                    {label}
                                </Link>
                            ) : (
                                <p className="block text-lg font-medium text-text-color-70">
                                    {label}
                                </p>
                            )}
                            {child_items?.length ? (
                                <ul className="list-disc list-inside mb-1 marker:text-text-color-50">
                                    {child_items.map((item, index) => {
                                        const { route, label } = item;
                                        const active = isActiveRoute(activeRoute, route);

                                        return (
                                            <Link
                                                key={index}
                                                to={route}
                                                className={twMerge(
                                                    'list-item px-3 text-base font-medium text-text-color',
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
                    'relative bg-text-color-0 hover:bg-text-color-10 group w-60 lg:w-72 xl:w-80',
                    isFirst && 'rounded-t-md',
                    isLast && 'rounded-b-md'
                )}
            >
                {hasData ? (
                    <Link
                        key={index}
                        to={route}
                        className={twMerge(
                            'block w-full h-full px-5 py-4 font-medium lg:text-base xl:text-lg text-text-color-90 hover:text-text-color',
                            active ? 'text-link-color' : '',
                            isParentRoute && 'underline decoration-link-color'
                        )}
                    >
                        {label}
                    </Link>
                ) : (
                    <p
                        className="w-full h-full px-5 py-4 font-medium lg:text-base xl:text-lg text-text-color-70"
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
            triggerClassName={`inline-flex items-center lg:text-base xl:text-lg font-semibold px-2 py-2 z-50 focus:outline-none ${
                !hasData && 'cursor-default'
            }`}
            options={buildNavigationMenu(child_items, 10, activeRoute)}
        />
    );
};
