// import React, { useEffect, useState } from 'react';
// import { twJoin, useSiteTheme } from '@uniwebcms/module-sdk';

// const parseLinks = (form) => {
//     if (!form?.length) return [];

//     const links = [];

//     form.forEach((item) => {
//         const { type, label, href, group_links } = item;

//         if (type === 'group' && group_links?.length) {
//             links.push({
//                 style: 'group',
//                 label,
//                 href,
//                 links: group_links.map((link) => ({
//                     label: link.label,
//                     href: link.href,
//                 })),
//             });
//         } else {
//             links.push({
//                 style: type,
//                 label,
//                 href,
//             });
//         }
//     });

//     return links;
// };

// export default function Header(props) {
//     const { block, website } = props;

//     const {
//         sticky = false,
//         navigation_position = 'right',
//         header_placement = 'above_hero',
//     } = block.getBlockProperties();

//     const { banner, images, title: logoText, form } = block.getBlockContent();

//     const allImages = [banner, ...images].filter(Boolean);

//     const [isScrolled, setIsScrolled] = useState(false);
//     const [isNavOpen, setIsNavOpen] = useState(false);

//     const { theme: finalTheme, setTheme, mode: themeMode } = useSiteTheme(true);
//     const { useLocation } = website.getRoutingComponents();
//     const location = useLocation();

//     // Close mobile nav on route change
//     useEffect(() => {
//         if (isNavOpen) {
//             setIsNavOpen(false);
//         }
//     }, [location.pathname]);

//     // Handle body scroll lock when mobile nav is open
//     useEffect(() => {
//         if (isNavOpen) {
//             document.body.style.overflow = 'hidden';
//         } else {
//             document.body.style.overflow = 'auto';
//         }
//         return () => {
//             document.body.style.overflow = 'auto';
//         };
//     }, [isNavOpen]);

//     // Scroll listener
//     useEffect(() => {
//         function onScroll() {
//             setIsScrolled(window.scrollY > 0);
//         }
//         onScroll();
//         window.addEventListener('scroll', onScroll, { passive: true });
//         return () => {
//             window.removeEventListener('scroll', onScroll);
//         };
//     }, []);

//     let logoImg = allImages.find((img) => {
//         return img.theme === finalTheme;
//     });

//     const links = parseLinks(form);

//     // Sort links into groups
//     const primaryLinks = links.filter((l) => l.style === 'primary' || l.style === 'secondary');
//     const plainLinks = links.filter((l) => !primaryLinks.includes(l));

//     return <nav></nav>;
// }

import React, { useEffect, useState, useRef } from 'react';
import { twJoin, useSiteTheme, getPageProfile } from '@uniwebcms/module-sdk';
import { Link, Image } from '@uniwebcms/core-components';
import { Menu, Transition } from '@headlessui/react';
import { HiBars3, HiChevronDown, HiXMark } from 'react-icons/hi2';

const parseLinks = (form) => {
    if (!form?.length) return [];

    const links = [];

    form.forEach((item) => {
        const { type, label, href, group_links } = item;

        if (type === 'group' && group_links?.length) {
            links.push({
                style: 'group',
                label,
                href,
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
            });
        }
    });

    return links;
};

// Component for a single plain/grouped link in the desktop navigation
const NavLink = ({ link, opensToRight = 'right' }) => {
    const isGroup = link.style === 'group';

    // Base className for all plain/grouped links
    const baseClassName =
        'bg-transparent text-link-color hover:text-link-hover-color transition-colors duration-200 text-sm 2xl:text-base font-medium focus:outline-none group';

    if (isGroup) {
        return (
            <Menu as="div" className="relative inline-block text-left">
                <Menu.Button className={twJoin(baseClassName, 'flex items-center space-x-1')}>
                    <span>{link.label}</span>
                    <HiChevronDown className="h-4 w-4 !text-inherit" />
                </Menu.Button>
                <Transition
                    as={React.Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <Menu.Items
                        className={twJoin(
                            opensToRight ? 'left-0' : 'right-0',
                            'absolute top-full mt-1 w-56 p-2 bg-bg-color border border-text-color/20 rounded-[var(--border-radius)] shadow-xl animate-in fade-in zoom-in-95 duration-200'
                        )}
                    >
                        {link.links.map((subLink, index) => (
                            <Menu.Item key={index}>
                                {({ active }) => {
                                    return (
                                        <Link
                                            to={subLink.href}
                                            className="block w-full text-left px-4 py-2.5 rounded-[var(--border-radius)] text-sm hover:bg-text-color/5"
                                        >
                                            {subLink.label}
                                        </Link>
                                        // <a
                                        //     onClick={(e) => {
                                        //         e.preventDefault();
                                        //         navigate(subLink.href);
                                        //     }}
                                        //     className={twJoin(
                                        //         active
                                        //             ? 'bg-text-color-10 text-text-color'
                                        //             : 'text-text-color/90',
                                        //         'block rounded-[var(--border-radius)] px-4 py-2 text-sm 2xl:text-base transition-colors duration-200 cursor-pointer'
                                        //     )}
                                        // >
                                        //     {subLink.label}
                                        // </a>
                                    );
                                }}
                            </Menu.Item>
                        ))}
                    </Menu.Items>
                </Transition>
            </Menu>
        );
    }

    return (
        <Link to={link.href} className={baseClassName}>
            {link.label}
        </Link>
    );
};

// Component for primary/secondary links in the desktop navigation
const ActionLink = ({ link, website }) => {
    const isPrimary = link.style === 'primary';

    const className = twJoin(
        'px-4 py-1.5 rounded-[var(--border-radius)] font-medium text-sm 2xl:text-base transition-colors duration-200 whitespace-nowrap',
        // Common base styles
        'border',
        // Primary Link Styles
        isPrimary
            ? 'bg-btn-color text-btn-text-color hover:bg-btn-hover-color hover:text-btn-hover-text-color border-btn-color hover:border-btn-hover-color'
            : // Secondary Link Styles
              'bg-btn-alt-color text-btn-alt-text-color hover:bg-btn-alt-hover-color hover:text-btn-alt-hover-text-color border-btn-alt-color hover:border-btn-alt-hover-color'
    );

    return (
        <Link to={link.href} className={className}>
            {link.label}
        </Link>
    );
};

// Component for Mobile Navigation Links
const MobileNavLink = ({ link, website }) => {
    const isGroup = link.style === 'group';

    const baseClassName =
        'block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200';

    // Primary/Secondary link styles are simplified for mobile
    const isAction = link.style === 'primary' || link.style === 'secondary';

    if (isGroup) {
        return (
            <div>
                <span
                    className={twJoin(
                        baseClassName,
                        'text-text-color/90 flex items-center space-x-1'
                    )}
                >
                    <span>{link.label}</span>
                    <HiChevronDown className="h-4 w-4 text-inherit" />
                </span>
                <div className="pl-6 pt-2 space-y-1">
                    {link.links.map((subLink, index) => (
                        <Link
                            key={index}
                            to={subLink.href}
                            className="block px-3 py-2 rounded-md text-base font-medium text-text-color/70 hover:text-text-color transition-colors duration-200"
                        >
                            {subLink.label}
                        </Link>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <Link
            to={link.href}
            className={twJoin(
                baseClassName,
                isAction
                    ? 'bg-btn-color text-btn-text-color hover:bg-btn-hover-color hover:text-btn-hover-text-color'
                    : 'text-text-color/90 hover:text-text-color'
            )}
        >
            {link.label}
        </Link>
    );
};

export default function Header(props) {
    const { block, website } = props;

    const {
        sticky = false,
        navigation_position = 'right', // 'right' or 'center'
        header_placement = 'above_hero', // 'above_hero' or 'overlay_hero'
    } = block.getBlockProperties();

    const { banner, images, title: logoText, form } = block.getBlockContent();

    const allImages = [banner, ...images].filter(Boolean);

    const navRef = useRef(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [navHeight, setNavHeight] = useState(0);

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

    // Measure the navigation bar's height on mount and when sticky/open state changes
    useEffect(() => {
        if (navRef.current) {
            setNavHeight(navRef.current.offsetHeight);
        }
    }, [isNavOpen, sticky, header_placement]); // Remeasure when these props/states change

    let logoImg =
        allImages.find((img) => {
            return img.theme === finalTheme;
        }) ??
        allImages[0] ??
        null;

    const links = parseLinks(form);

    // Sort links into groups
    const primaryLinks = links.filter((l) => l.style === 'primary' || l.style === 'secondary');
    const plainAndGroupedLinks = links.filter((l) => !primaryLinks.includes(l));

    // Conditional styling based on properties
    const isOverlay = header_placement === 'overlay_hero';

    // Sticky ClassNames
    const stickyClass = sticky
        ? 'fixed top-0 left-0 right-0 z-40 shadow-sm transition-all duration-300'
        : 'absolute inset-x-0 top-0 z-40';

    // Positioning ClassNames
    const positionClass = sticky
        ? '' // Use the positioning from stickyClass ('fixed')
        : isOverlay
        ? 'absolute inset-x-0 top-0 z-40' // Overlay needs to stay above hero even when not sticky
        : 'relative'; // Not sticky, not overlay: use 'relative'

    // Determine if we should show a solid/opaque background
    const shouldBeOpaque = !isOverlay || isScrolled;

    // Determine the base background class for the nav element
    let bgClass = '';

    if (shouldBeOpaque) {
        // This applies to: (Not overlay) OR (Is overlay AND Scrolled)

        // Check if we need the semi-transparent (80% opacity) effect.
        // This happens only when sticky and scrolled.
        const isSemiOpaque = sticky && isScrolled;

        if (isSemiOpaque) {
            // Sticky and Scrolled: Use background-color with 80% opacity and blur
            bgClass =
                'bg-[color:color-mix(in_srgb,var(--header-bg,var(--bg-color))_80%,transparent)] backdrop-blur-sm ';
        } else {
            // Not sticky/scrolled, or not sticky at all: Use full background-color (100% opacity)
            bgClass = 'bg-[var(--header-bg,var(--bg-color))]';
        }
    } else {
        // This applies to: Is overlay AND NOT Scrolled (Initial state of an overlay header)
        bgClass = 'bg-transparent';
    }

    // Navigation position class
    const navPositionClass =
        navigation_position === 'center' ? 'flex-1 justify-center' : 'justify-end';

    return (
        <React.Fragment>
            {sticky && !isOverlay && (
                <div
                    id="main-navbar-placeholder"
                    style={{ height: `${navHeight}px`, background: 'unset' }}
                />
            )}
            <nav
                id="main-navbar"
                ref={navRef}
                className={twJoin('w-full', stickyClass, bgClass, positionClass)}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo Section */}
                        <div className="flex-shrink-0">
                            <Link to="/" className="flex items-center space-x-3">
                                {logoImg && (
                                    <Image
                                        className="h-9 w-auto rounded-[var(--border-radius)]"
                                        profile={getPageProfile()}
                                        {...logoImg}
                                    />
                                )}
                                <span className="text-xl font-bold text-text-color">
                                    {logoText}
                                </span>
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <div
                            className={twJoin(
                                'hidden md:flex flex-grow items-center',
                                navPositionClass
                            )}
                        >
                            <div className="flex items-center space-x-6 lg:space-x-8">
                                {/* Plain and Grouped Links */}
                                {plainAndGroupedLinks.map((link, index) => (
                                    <NavLink
                                        key={index}
                                        link={link}
                                        opensToRight={navPositionClass === 'center'}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Primary/Secondary Links for Desktop */}
                        <div className="hidden md:flex items-center space-x-3 ml-8">
                            {primaryLinks.map((link, index) => (
                                <ActionLink key={index} link={link} website={website} />
                            ))}
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden">
                            <button
                                type="button"
                                onClick={() => setIsNavOpen(!isNavOpen)}
                                className="inline-flex items-center justify-center p-2 rounded-[var(--border-radius)] text-text-color/70 bg-transparent hover:text-text-color hover:bg-text-color/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-text-color/20"
                                aria-controls="mobile-menu"
                                aria-expanded="false"
                            >
                                <span className="sr-only">Open main menu</span>
                                {isNavOpen ? (
                                    <HiXMark
                                        className="block h-6 w-6 text-inherit"
                                        aria-hidden="true"
                                    />
                                ) : (
                                    <HiBars3
                                        className="block h-6 w-6 text-inherit"
                                        aria-hidden="true"
                                    />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation Panel */}
                {isNavOpen && (
                    <div
                        className="md:hidden bg-[var(--header-bg,var(--bg-color))] absolute inset-x-0 z-30 min-h-screen"
                        style={{ top: `${navHeight}px` }}
                        id="mobile-menu"
                    >
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            {/* All links in order for mobile */}
                            {[...plainAndGroupedLinks, ...primaryLinks].map((link, index) => (
                                <MobileNavLink key={index} link={link} website={website} />
                            ))}
                        </div>
                    </div>
                )}
            </nav>
        </React.Fragment>
    );
}
