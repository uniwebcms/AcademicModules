import React, { useState, useEffect } from 'react';
import { twJoin, twMerge, getPageProfile, useSiteTheme, website } from '@uniwebcms/module-sdk';
import { Image, Link } from '@uniwebcms/core-components';
import { ThemeSelector } from './ThemeSelector';
import { useSidebar } from '../_utils/SidebarContext';
import { HiMiniBars3BottomLeft, HiMiniBars3, HiMiniBars3BottomRight } from 'react-icons/hi2';
import { HiX } from 'react-icons/hi';
import { LuChevronDown } from 'react-icons/lu';
import PopoverMenu from './PopoverMenu';
import LangSwitch from './LangSwitch';
import Search from './SiteSearch';
import Icon from './Icon';

const parseLinks = (form) => {
    if (!form?.length) return [];

    const links = [];

    form.forEach((item) => {
        const { type, label, href, icon, group_links } = item;

        if (type === 'group' && group_links?.length) {
            links.push({
                style: 'group',
                label,
                href,
                icon,
                links: group_links.map((link) => ({
                    label: link.label,
                    href: link.href,
                })),
            });
        } else {
            links.push({
                style: type,
                label,
                href,
                icon,
            });
        }
    });

    return links;
};

const findNavigationRoute = (navigationItem) => {
    if (navigationItem.hasData) return navigationItem.route;

    // iterate through child items to find a valid route, return the first one hasData, use DFS
    for (const child of navigationItem.child_items || []) {
        const route = findNavigationRoute(child);
        if (route) return route;
    }

    return null;
};

// return true if node route is a parent of current route
const isParent = (current, node) => {
    const firstSegment = current.split('/')[1];

    return firstSegment === node.route;
};

// Mobile Nav Menu Component
const MobileNavMenu = ({ links, isOpen, closeNav, siteNavigation }) => {
    // Define common styles
    const buttonStyles =
        'border-[length:var(--depth-style-outline)] rounded-[var(--border-radius)] [box-shadow:var(--depth-style-shadow)]';
    const linkBaseClass = 'flex items-center gap-3 w-full px-3 py-2 rounded-md text-text-color';

    return (
        <>
            {/* Overlay */}
            <div
                className={twJoin(
                    'md:hidden fixed left-0 w-full bg-black/50 z-40',
                    siteNavigation ? 'top-28 h-[calc(100vh-112px)]' : 'top-16 h-[calc(100vh-64px)]',
                    isOpen ? 'block' : 'hidden'
                )}
                onClick={closeNav}
            />
            {/* Panel */}
            <div
                className={twJoin(
                    'md:hidden fixed right-0 w-full z-50 transition-transform transform duration-300 shadow-lg',
                    siteNavigation ? 'top-28 h-[calc(100vh-112px)]' : 'top-16 h-[calc(100vh-64px)]',
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                )}
            >
                <button
                    className="absolute top-4 left-4 focus:outline-none bg-transparent"
                    onClick={closeNav}
                >
                    <HiX className="h-6 w-6 text-gray-200 hover:text-gray-100" />
                </button>
                <div className="pl-14 h-full">
                    <div className="overflow-y-auto h-full p-6 md:p-8 flex flex-col gap-2 bg-text-color-0">
                        {links.map((link, i) => {
                            const { style, label, href, icon } = link;

                            if (style === 'group') {
                                return (
                                    <details key={i} className="w-full group">
                                        <summary className="flex items-center justify-between w-full px-3 py-2 rounded-md hover:bg-text-color/10 cursor-pointer list-none">
                                            <span className="flex items-center gap-3">
                                                {icon && icon !== 'none' && (
                                                    <Icon
                                                        icon={icon}
                                                        className="h-5 w-5 flex-shrink-0"
                                                    />
                                                )}
                                                {label && (
                                                    <span className="font-medium whitespace-nowrap truncate">
                                                        {label}
                                                    </span>
                                                )}
                                            </span>
                                            <LuChevronDown className="h-5 w-5 text-text-color/70 group-open:rotate-180 transition-transform" />
                                        </summary>
                                        <div className="pl-6 pt-2 flex flex-col gap-2">
                                            {link.links.map((item, j) => (
                                                <Link
                                                    key={j}
                                                    to={item.href}
                                                    className={twJoin(
                                                        linkBaseClass,
                                                        'hover:bg-text-color/10'
                                                    )}
                                                >
                                                    {item.label}
                                                </Link>
                                            ))}
                                        </div>
                                    </details>
                                );
                            }

                            let linkClass = twJoin(linkBaseClass, 'hover:bg-text-color/10');
                            if (style === 'primary' || style === 'secondary') {
                                const isPrimary = style === 'primary';
                                const buttonTypeClass = isPrimary
                                    ? 'bg-btn-color text-btn-text-color hover:bg-btn-hover-color hover:text-btn-hover-text-color'
                                    : 'bg-btn-alt-color text-btn-alt-text-color hover:bg-btn-alt-hover-color hover:text-btn-alt-hover-text-color';

                                linkClass = twMerge(
                                    linkBaseClass,
                                    buttonStyles,
                                    buttonTypeClass,
                                    'justify-center font-medium'
                                );
                            }

                            return (
                                <Link key={i} to={href} className={linkClass}>
                                    {label && (
                                        <span className="font-medium whitespace-nowrap truncate">
                                            {label}
                                        </span>
                                    )}
                                    {icon && icon !== 'none' && (
                                        <Icon
                                            icon={icon}
                                            className="h-5 w-5 flex-shrink-0 text-inherit"
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
};

export default function Header(props) {
    const { block, website } = props;

    const {
        sticky = true,
        mode = 'full_width',
        search_position: searchPosition = 'center',
        transparency = true,
        site_navigation: siteNavigation = false,
    } = block.getBlockProperties();

    const { banner, images, form } = block.getBlockContent();

    const allImages = [banner, ...images].filter(Boolean);

    const [isScrolled, setIsScrolled] = useState(false);
    const [isNavOpen, setIsNavOpen] = useState(false);

    const { toggleSidebar } = useSidebar();
    const { theme: finalTheme, setTheme, mode: themeMode } = useSiteTheme(true);
    const { useLocation } = website.getRoutingComponents();
    const location = useLocation();

    // Close mobile nav on route change
    useEffect(() => {
        if (isNavOpen) {
            setIsNavOpen(false);
        }
    }, [location.pathname]);

    // Handle body scroll lock when mobile nav is open
    useEffect(() => {
        if (isNavOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isNavOpen]);

    // Scroll listener
    useEffect(() => {
        function onScroll() {
            setIsScrolled(window.scrollY > 0);
        }
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', onScroll);
        };
    }, []);

    let logoImg = allImages.find((img) => {
        return img.theme === finalTheme;
    });

    const links = parseLinks(form);

    // Sort links into groups
    const primaryLinks = links.filter((l) => l.style === 'primary' || l.style === 'secondary');
    const iconOnlyLinks = links.filter(
        (l) => l.style === 'plain' && !l.label && l.icon && l.icon !== 'none'
    );
    const regularLinks = links.filter(
        (l) => !primaryLinks.includes(l) && !iconOnlyLinks.includes(l)
    );

    // get site hierarchy for site navigation
    const hierarchy = website.getPageHierarchy({
        nested: true,
        pageOnly: false,
    });

    // Define common styles
    const buttonStyles =
        'border-[length:var(--depth-style-outline)] rounded-[var(--border-radius)] [box-shadow:var(--depth-style-shadow)]';
    const linkBaseClass =
        'flex items-center gap-2 px-3 py-[7px] text-sm font-medium transition-colors duration-200';

    const outerWrapperClass = siteNavigation ? ['h-28'] : ['h-16'];

    if (mode === 'full_width') {
        outerWrapperClass.push('w-full max-w-screen border-b border-text-color/20');
    } else {
        outerWrapperClass.push(
            'my-0 desktop:my-2 w-full max-w-screen desktop:max-w-8xl mx-auto border-b desktop:border border-text-color/20 desktop:rounded-lg'
        );
    }

    if (sticky) {
        outerWrapperClass.push('transition duration-500');

        if (isScrolled) {
            outerWrapperClass.push('shadow-md border-none');
            if (transparency) {
                outerWrapperClass.push(
                    'backdrop-blur bg-[color-mix(in_lch,var(--header-bg,var(--bg-color))_60%,transparent)]'
                );
            } else {
                outerWrapperClass.push('bg-[var(--header-bg,var(--bg-color))]');
            }
        } else {
            outerWrapperClass.push('bg-[var(--header-bg,var(--bg-color))]');
        }
    } else {
        outerWrapperClass.push('bg-[var(--header-bg,var(--bg-color))]');
    }

    return (
        <>
            <div className={twJoin(...outerWrapperClass)}>
                <div className="flex flex-col w-full">
                    {/* regular header content wrapper */}
                    <div
                        className={twJoin(
                            'h-16 flex items-center justify-between max-w-full desktop:max-w-[88rem] mx-auto py-3',
                            mode === 'full_width'
                                ? 'w-full px-6 md:px-8 lg:px-12 desktop:px-0'
                                : 'w-full px-6 md:px-8 lg:px-12 desktop:px-4'
                        )}
                    >
                        <div className="w-auto lg:w-64 flex-shrink-0 flex items-center justify-start">
                            <button
                                className="group md:hidden p-1 rounded-md bg-transparent hover:bg-text-color/10 focus:outline-none mr-2"
                                onClick={toggleSidebar}
                            >
                                <span className="sr-only">Toggle Sidebar</span>
                                <HiMiniBars3BottomLeft className="h-6 w-6 text-text-color/80 group-hover:text-text-color" />
                            </button>
                            {/* Logo Image */}
                            {logoImg ? (
                                <Link
                                    to="/"
                                    ariaLabel={website.localize({
                                        en: 'Company logo',
                                        fr: 'Logo de l’entreprise',
                                        es: 'Logo de la empresa',
                                        zh: '公司标志',
                                    })}
                                >
                                    <Image
                                        profile={getPageProfile()}
                                        {...logoImg}
                                        className="h-10 w-auto"
                                    />
                                </Link>
                            ) : null}
                        </div>
                        {searchPosition === 'center' ? (
                            <div className="hidden md:block">
                                <Search {...props} searchPosition={searchPosition} enableShortcut />
                            </div>
                        ) : null}
                        <div className="h-full w-auto lg:w-64 flex-shrink-0 flex items-center justify-end gap-3 xl:gap-4">
                            {/* Render Regular and Icon-Only Links */}
                            <div className="hidden md:flex items-center gap-3 xl:gap-4">
                                {/* Regular Links */}
                                {regularLinks.map((link, i) => {
                                    const { style, label, href, icon } = link;

                                    if (style === 'plain') {
                                        return (
                                            <Link
                                                key={i}
                                                to={href}
                                                className="flex items-center gap-2 text-text-color/90 hover:text-text-color transition-colors duration-200"
                                            >
                                                {icon && icon !== 'none' && (
                                                    <Icon
                                                        icon={icon}
                                                        className="h-5 w-5 flex-shrink-0"
                                                    />
                                                )}
                                                {label && (
                                                    <span className="text-sm font-medium whitespace-nowrap truncate max-w-32">
                                                        {label}
                                                    </span>
                                                )}
                                            </Link>
                                        );
                                    }

                                    if (style === 'group') {
                                        const trigger = (
                                            <div
                                                className={twJoin(
                                                    linkBaseClass,
                                                    buttonStyles,
                                                    'border-text-color/20 cursor-pointer hover:bg-text-color-0'
                                                )}
                                            >
                                                {icon && icon !== 'none' && (
                                                    <Icon
                                                        icon={icon}
                                                        className="h-4 w-4 flex-shrink-0"
                                                    />
                                                )}
                                                {label && (
                                                    <span className="whitespace-nowrap truncate max-w-32">
                                                        {label}
                                                    </span>
                                                )}
                                                <LuChevronDown className="h-4 w-4 text-text-color/70 ml-1" />
                                            </div>
                                        );

                                        const options = link.links.map((item, j) => (
                                            <Link
                                                key={j}
                                                to={item.href}
                                                className="block w-full px-4 py-2 text-left text-sm text-text-color hover:bg-text-color/10"
                                            >
                                                {item.label}
                                            </Link>
                                        ));

                                        return (
                                            <PopoverMenu
                                                key={i}
                                                trigger={trigger}
                                                options={options}
                                                menuClassName={twJoin(
                                                    buttonStyles,
                                                    'bg-text-color-0 w-48 mt-2'
                                                )}
                                                autoClose={true}
                                            />
                                        );
                                    }
                                    return null;
                                })}

                                {/* Icon-Only Links */}
                                {iconOnlyLinks.map((link, i) => (
                                    <Link
                                        key={i}
                                        to={link.href}
                                        className="flex items-center gap-2"
                                        aria-label={link.icon}
                                    >
                                        <Icon
                                            icon={link.icon}
                                            className="h-5 w-5 text-icon-color hover:text-icon-color/80 transition-colors duration-200"
                                        />
                                    </Link>
                                ))}
                            </div>

                            {/* Search (right position) */}
                            <div
                                className={twJoin(
                                    searchPosition === 'center' ? 'md:hidden block' : 'block'
                                )}
                            >
                                <Search {...props} enableShortcut={searchPosition !== 'center'} />
                            </div>
                            <ThemeSelector
                                className="relative z-10"
                                {...{ theme: themeMode, finalTheme, setTheme }}
                            />
                            <LangSwitch website={website} />

                            {/* Primary/Secondary Links (Desktop) */}
                            <div className="hidden md:flex items-center gap-3 xl:gap-4">
                                {primaryLinks.map((link, i) => {
                                    const { style, label, href, icon } = link;
                                    const isPrimary = style === 'primary';
                                    const buttonTypeClass = isPrimary
                                        ? 'bg-btn-color text-btn-text-color hover:bg-btn-hover-color hover:text-btn-hover-text-color'
                                        : 'bg-btn-alt-color text-btn-alt-text-color hover:bg-btn-alt-hover-color hover:text-btn-alt-hover-text-color';

                                    return (
                                        <Link
                                            key={i}
                                            to={href}
                                            className={twJoin(
                                                linkBaseClass,
                                                buttonStyles,
                                                buttonTypeClass
                                            )}
                                        >
                                            {label && (
                                                <span className="whitespace-nowrap truncate max-w-32">
                                                    {label}
                                                </span>
                                            )}
                                            {icon && icon !== 'none' && (
                                                <Icon
                                                    icon={icon}
                                                    className="h-4 w-4 flex-shrink-0 text-inherit"
                                                />
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>

                            {/* Mobile Nav Toggle Button */}
                            <button
                                className="group md:hidden p-1 rounded-md bg-transparent hover:bg-text-color/10 focus:outline-none"
                                onClick={() => setIsNavOpen(!isNavOpen)}
                            >
                                <span className="sr-only">Toggle Navigation</span>
                                <HiMiniBars3BottomRight className="h-6 w-6 text-text-color/80 group-hover:text-text-color" />
                            </button>
                        </div>
                    </div>
                    {siteNavigation && (
                        <div
                            className={twJoin(
                                'h-12 flex items-center space-x-2 lg:space-x-3 max-w-full desktop:max-w-[88rem] mx-auto overflow-x-auto',
                                mode === 'full_width'
                                    ? 'w-full px-6 md:px-8 lg:px-12 desktop:px-0 py-2'
                                    : 'w-full px-6 md:px-8 lg:px-12 desktop:px-4 pt-1 pb-3'
                            )}
                        >
                            {hierarchy.map((item, index) => (
                                <Link
                                    key={index}
                                    to={findNavigationRoute(item) || '/'}
                                    className={twJoin(
                                        'border-b-2 transition-colors duration-200 whitespace-nowrap px-3 pt-1 pb-1.5 text-sm font-medium',
                                        website.activePage.activeRoute.split('/')[0] === item.route
                                            ? 'border-link-active-color/60 text-link-active-color'
                                            : 'border-transparent'
                                    )}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Nav Panel */}
            <MobileNavMenu
                links={links}
                isOpen={isNavOpen}
                closeNav={() => setIsNavOpen(false)}
                siteNavigation={siteNavigation}
            />
        </>
    );
}
