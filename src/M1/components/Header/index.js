import React, { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { HiBars3, HiXMark } from 'react-icons/hi2';
import { Link, twMerge, Image, twJoin, getPageProfile, Icon } from '@uniwebcms/module-sdk';
import { CgChevronDown } from 'react-icons/cg';
import PopoverMenu from '../_utils/PopoverMenu';
import LanguageToggle from './LanguageToggle';
// import SiteSearch from './SiteSearch';
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

export default function Header(props) {
    const { block, website, page } = props;
    const { themeName: theme, main } = block;
    const { sticky = false, alignment = 'left', mode = 'page' } = block.getBlockProperties();

    const nextBlockContext = getNextBlockContext(block);

    const { theme: nextTheme = '', allowTranslucentTop = false } = nextBlockContext;

    let navigation = [];

    if (mode == 'manual') {
        navigation = block.getBlockLinks({ nested: true });
    } else if (mode == 'page') {
        navigation = website.getPageHierarchy({
            nested: true,
            filterEmpty: true,
        });
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
                    'transition-transform duration-300 flex items-center w-full px-6 lg:px-10 xl:px-12 2xl:px-16 py-3 lg:py-4 xl:py-5 2xl:py-6 justify-between lg:justify-normal max-w-10xl mx-auto'
                )}
            >
                {logo ? (
                    <Link
                        to=""
                        title="company logo"
                        className="w-fit max-w-[9rem] lg:max-w-[10rem] 2xl:max-w-[12rem] flex-shrink-0"
                    >
                        <div className="h-8 lg:h-10 2xl:h-12 w-auto max-w-full">{logo}</div>
                    </Link>
                ) : null}
                <nav
                    className={twJoin(
                        'hidden lg:flex 2xl:space-x-6 xl:space-x-4 lg:space-x-2 items-center w-full',
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

                            return (
                                <Link
                                    key={index}
                                    to={route}
                                    className="inline-block lg:text-base xl:text-lg px-3 py-2"
                                >
                                    {label}
                                </Link>
                            );
                        }
                    })}
                </nav>
                <div className="flex items-center space-x-8 justify-end">
                    <div className="whitespace-nowrap">
                        <span className="text-text-color-10 lg:text-base xl:text-lg font-medium">
                            {website.localize({
                                en: 'Log in',
                                fr: 'Connexion',
                            })}
                        </span>
                    </div>
                    <div className="whitespace-nowrap rounded-3xl px-6 py-2.5 bg-text-color/60">
                        <span className="text-text-color-10 lg:text-base xl:text-lg font-medium">
                            {website.localize({
                                en: 'Sign up',
                                fr: 'Inscription',
                            })}
                        </span>
                    </div>
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
                                                'mr-2 inline-block px-3 py-2 text-xl font-semibold leading-7 text-text-color'
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
                        'block px-3 py-2 text-xl font-semibold leading-7 text-text-color-90 hover:text-text-color w-fit'
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
                                        'block text-lg font-medium leading-7 text-text-color-90 hover:text-text-color w-fit'
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
                                                    'list-item px-3 text-base font-semibold leading-7 text-text-color-90 hover:text-text-color w-fit'
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
    const linkClass = 'inline-flex items-center space-x-1 xl:text-xl lg:text-lg px-3 py-2 group';
    const iconClass =
        'w-5 h-5 mb-0.5 text-inherit transition-transform transform group-hover:translate-y-0.5 duration-300';

    const trigger = hasData ? (
        <Link to={route} className={linkClass}>
            <p>{label}</p>
            <CgChevronDown className={iconClass} />
        </Link>
    ) : (
        <div className={linkClass}>
            <p>{label}</p>
            <CgChevronDown className={iconClass} />
        </div>
    );

    return (
        <PopoverMenu
            trigger={trigger}
            options={buildNavigationMenu(child_items, 10, activeRoute, theme)}
        />
    );
};
