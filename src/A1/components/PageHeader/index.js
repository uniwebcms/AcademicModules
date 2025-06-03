import { useRef, useCallback, useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { HiBars3, HiXMark } from 'react-icons/hi2';
import { twMerge, twJoin, getPageProfile } from '@uniwebcms/module-sdk';
import { Link, Image, Icon } from '@uniwebcms/core-components';
import { CgChevronDown } from 'react-icons/cg';
import PopoverMenu from './components/PopoverMenu';
import LanguageToggle from './components/LanguageToggle';
import SiteSearch from './components/SiteSearch';
import { getNextBlockContext } from '../_utils/context';
import './style.css';

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

    const navRef = useRef(null);

    const navLeftAligned = alignment === 'left';
    const logoCentered = logo_position === 'center';

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

    if (!navLeftAligned) {
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
                <Icon icon={firstIcon} className="h-10 w-auto max-w-full" />
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
                            logoCentered ? 'h-10 lg:h-14' : 'h-10'
                        )}
                    />
                </Link>
            );
        }
    }

    return (
        <>
            {/* Placeholder div to prevent content jump */}
            {sticky && !allowTranslucentTop && (
                <div
                    style={{
                        height: initialPosition ? '0px' : `${navRef.current?.offsetHeight}px`,
                    }}
                />
            )}

            <div
                ref={navRef}
                className={twMerge(wrapperClass, !initialPosition && sticky && '!shadow-2xl')}
            >
                <div
                    className={twMerge(
                        'relative transition-transform duration-300 flex items-center w-full lg:px-12 px-6 py-3 justify-between lg:justify-normal max-w-10xl mx-auto',
                        logoCentered && 'pt-3 lg:pt-[70px]'
                    )}
                >
                    <div
                        className={twJoin(
                            'w-32 lg:w-28 flex-shrink-0',
                            logoCentered &&
                                'lg:block lg:w-auto lg:absolute lg:top-2.5 lg:left-1/2 lg:-translate-x-1/2'
                        )}
                    >
                        {logo}
                    </div>
                    <nav
                        className={twJoin(
                            'hidden lg:flex items-center w-full sm:h-10 [&>*]:lg:mx-2 [&>*]:xl:mx-3 [&>*]:2xl:mx-4',
                            navLeftAligned ? 'justify-start' : 'justify-center',
                            !navLeftAligned && logoCentered ? 'ml-0 lg:ml-32' : '',
                            navLeftAligned && logoCentered ? '[&>*:first-child]:-ml-3.5' : ''
                        )}
                    >
                        {navigation.map((page, index) => {
                            if (page.child_items?.length) {
                                return (
                                    <NavbarMenu
                                        key={index}
                                        {...page}
                                        leftAligned={navLeftAligned}
                                        activeRoute={activeRoute}
                                    />
                                );
                            } else {
                                const { route, label } = page;

                                return (
                                    <Link
                                        key={index}
                                        to={route}
                                        className="inline-block lg:text-base xl:text-lg font-semibold px-3.5 py-1.5 text-text-color-80 hover:text-text-color hover:bg-text-color/10 rounded-lg"
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
                                        return <MobileNavbarMenu key={index} {...page} />;
                                    } else {
                                        const { route, label } = page;

                                        return (
                                            <Link
                                                key={index}
                                                to={route}
                                                className="mr-5 inline-block py-2 text-lg font-medium text-text-color"
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
        </>
    );
}

const MobileNavbarMenu = ({ label, route, child_items, hasData }) => {
    return (
        <div>
            {hasData ? (
                <Link
                    to={route}
                    className="block py-2 text-lg font-medium leading-7 text-text-color-90"
                >
                    {label}
                </Link>
            ) : (
                <p className="py-2 text-lg font-medium text-text-color-70">{label}</p>
            )}
            <div className="px-3 mt-1 mb-2 flex flex-col space-y-2 border-l-2">
                {child_items.map((item, index) => {
                    const { route, label, child_items, hasData } = item;

                    return (
                        <div key={index} className={twJoin('')}>
                            {hasData ? (
                                <Link
                                    key={index}
                                    to={route}
                                    className="block text-base text-text-color"
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

                                        return (
                                            <Link
                                                key={index}
                                                to={route}
                                                className="list-item px-3 text-base font-medium text-text-color"
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

const NavbarMenu = ({ label, route, child_items, hasData, leftAligned, activeRoute }) => {
    const renderTrigger = useCallback(
        (menuOpened) => {
            const Wrapper = hasData ? Link : 'div';
            const wrapperProps = hasData ? { to: route } : {};

            return (
                <Wrapper
                    className={twJoin(
                        'inline-flex items-center lg:text-base xl:text-lg font-semibold pl-3.5 pr-2 py-1.5 focus:outline-none rounded-lg gap-x-1',
                        menuOpened
                            ? 'bg-text-color/10 text-text-color'
                            : 'text-text-color-80 hover:text-text-color'
                    )}
                    {...wrapperProps}
                >
                    {label}
                    <CgChevronDown
                        className={twJoin(
                            'w-5 h-5 text-inherit',
                            menuOpened ? 'rotate-180 transition-transform duration-150' : ''
                        )}
                    />
                </Wrapper>
            );
        },
        [label, route, hasData]
    );

    const options = child_items.map((item, index) => {
        const { route, label, child_items, hasData } = item;

        const TitleWrapper = hasData ? Link : 'div';
        const titleWrapperProps = hasData ? { to: route } : {};

        return (
            <div className="w-full" key={index}>
                <TitleWrapper
                    className={twJoin(
                        'font-semibold text-base text-text-color',
                        hasData && 'hover:text-link-color'
                    )}
                    {...titleWrapperProps}
                >
                    {label}
                </TitleWrapper>
                {child_items.length ? (
                    <ul className="flex flex-col mt-2.5 gap-y-2">
                        {child_items.map((childItem, childIndex) => {
                            const {
                                route: childRoute,
                                label: childLabel,
                                hasData: childHasData,
                            } = childItem;

                            const ChildWrapper = childHasData ? Link : 'div';
                            const childWrapperProps = childHasData ? { to: childRoute } : {};

                            return (
                                <ChildWrapper
                                    key={childIndex}
                                    className={twJoin(
                                        'text-sm font-medium text-text-color-60 hover:text-link-color'
                                    )}
                                    {...childWrapperProps}
                                >
                                    {childLabel}
                                </ChildWrapper>
                            );
                        })}
                    </ul>
                ) : null}
            </div>
        );
    });

    const maxMenuTitleLength = child_items.reduce((max, item) => {
        const itemLength = item.label.length;
        return itemLength > max ? itemLength : max;
    }, 0);

    let columnSize = 'sm';
    if (maxMenuTitleLength > 60) {
        columnSize = 'xl';
    } else if (maxMenuTitleLength > 40) {
        columnSize = 'lg';
    } else if (maxMenuTitleLength > 20) {
        columnSize = 'md';
    }

    return (
        <PopoverMenu
            renderTrigger={renderTrigger}
            options={options}
            openTo={leftAligned ? 'right' : 'justify'}
            columnSize={columnSize}
            activeRoute={activeRoute}
        />
    );
};
