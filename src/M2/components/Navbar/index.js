import React, { useState, useEffect } from 'react';
import { getPageProfile, twJoin } from '@uniwebcms/module-sdk';
import { Icon, Image, Link } from '@uniwebcms/core-components';
import { LuMenu, LuChevronDown, LuX } from 'react-icons/lu';
import DropdownMenu from './components/DropdownMenu';

const parseNavbarContent = (block) => {
    const { themeName } = block;
    const { banner, icons, images: blockImgs } = block.getBlockContent();

    const icon = icons[0];
    const logoImg = [banner, ...blockImgs]
        .filter(Boolean)
        .find((img) => img.caption === `logo-${themeName.split('__')[1]}`);
    const linkGroups = block.getBlockLinks({ nested: true, grouped: true });

    const logo = icon ? (
        <Icon icon={icon} className="w-full h-full" />
    ) : logoImg ? (
        <Image profile={getPageProfile()} {...logoImg} className="w-full h-auto object-contain" />
    ) : null;

    return {
        logo,
        linkGroups,
    };
};

const setWrapperStyle = (theme, block, style) => {
    const context = theme?.split('__')?.[1];
    const colors = block.standardOptions?.colors?.elements?.[context] || {};
    const vars = block.standardOptions?.colors?.vars?.[context] || {};

    Object.keys(vars).forEach((key) => {
        style[`${key}`] = vars[key];
    });

    Object.keys(colors).forEach((key) => {
        style[`--${key}`] = colors[key];
    });
};

export default function navbar(props) {
    const { block, website, page } = props;

    const { navigation_generation_mode = 'auto', navigation_link_alignment = 'left' } =
        block.getBlockProperties();

    let navigationLinks = [],
        accountLinks = [];

    if (navigation_generation_mode === 'manual') {
        const linkGroups = block.getBlockLinks({ nested: true, grouped: true });
        [navigationLinks = [], accountLinks = []] = linkGroups;
    } else {
        navigationLinks = website.getPageHierarchy({
            nested: true,
            filterEmpty: false,
        });
    }

    const { logo } = parseNavbarContent(block);

    const firstBodyBlock = page.blockGroups.body?.[0];

    const [mobileOpen, setMobileOpen] = useState(false);
    const [expandedGroups, setExpandedGroups] = useState({});

    useEffect(() => {
        if (firstBodyBlock?.id) {
            const blockElement = document.getElementById(`Section${firstBodyBlock.id}`);
            if (blockElement) {
                // programmatically add some padding top to the first body block
                const extraPadding = window.innerWidth < 1280 ? 64 : 80;
                blockElement.style.paddingTop = `${extraPadding}px`;
            }
        }
    }, [firstBodyBlock]);

    useEffect(() => {
        if (mobileOpen) {
            document.body.classList.add('overflow-hidden');
        } else {
            document.body.classList.remove('overflow-hidden');
        }
    }, [mobileOpen]);

    useEffect(() => {
        setMobileOpen(false);
    }, [page.activeRoute]);

    const popoverStyle = {};
    setWrapperStyle(website.themeName, block, popoverStyle);

    return (
        <>
            {/* Desktop Navbar */}
            <nav className="p-6 w-full hidden xl:flex fixed z-[1000] left-[50%] transform -translate-x-[50%] h-20 rounded-xl backdrop-blur-sm mt-[10px] max-w-[1400px] bg-neutral-50/75">
                <div className="flex gap-6 items-center w-full">
                    {/* Logo */}
                    <div className="flex-shrink-0 w-28 mr-6">
                        <Link to="">{logo}</Link>
                    </div>
                    {/* Links */}
                    <div className="flex gap-6 items-center justify-between w-full">
                        <ul
                            className={twJoin(
                                'flex items-center gap-6 flex-grow',
                                navigation_link_alignment === 'left' && 'justify-start',
                                navigation_link_alignment === 'center' && 'justify-center',
                                navigation_link_alignment === 'right' && 'justify-end'
                            )}
                        >
                            {navigationLinks.map((link, index) => {
                                const { label, route, child_items, hasData } = link;

                                const element =
                                    hasData && child_items.length ? (
                                        <div className="flex items-center gap-1">
                                            <Link to={route} className="font-medium">
                                                {label}
                                            </Link>
                                            <LuChevronDown className="ui-open:rotate-180 ui-open:transform" />
                                        </div>
                                    ) : child_items.length > 0 ? (
                                        <div className="flex items-center gap-1">
                                            <p className="font-medium">{label}</p>
                                            <LuChevronDown className="ui-open:rotate-180 ui-open:transform" />
                                        </div>
                                    ) : (
                                        <Link to={route} className="font-medium">
                                            {label}
                                        </Link>
                                    );

                                return (
                                    <li
                                        key={index}
                                        className={twJoin('group relative flex items-center')}
                                    >
                                        {child_items.length > 0 ? (
                                            <DropdownMenu
                                                trigger={element}
                                                menuItems={child_items}
                                                openFrom={'left'}
                                                positionOffset={index + 1}
                                            />
                                        ) : (
                                            element
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                        {/* Account Links */}
                        <ul className="flex items-center gap-6">
                            {accountLinks.map((link, index) => {
                                const { label, route } = link;

                                return (
                                    <Link
                                        key={index}
                                        to={route}
                                        className={twJoin(
                                            'font-medium',
                                            index === accountLinks.length - 1 &&
                                                'block bg-btn-color text-btn-text-color hover:bg-btn-hover-color hover:text-btn-hover-text-color py-2 px-5 rounded-xl'
                                        )}
                                    >
                                        {label}
                                    </Link>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            </nav>
            {/* Mobile Navbar */}
            <nav className="block w-full xl:hidden relative z-20">
                {/* Top bar: fixed logo, signup, menu button */}
                <div className="flex gap-6 items-center w-full justify-between fixed left-0 top-0 right-0 px-4 sm:px-6 py-4 bg-white z-50 h-[64px]">
                    {/* Logo */}
                    <div className="flex-shrink-0 w-24">
                        <Link to="" onClick={() => setMobileOpen(false)}>
                            {logo}
                        </Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <div
                            className="relative"
                            aria-label="Toggle Menu"
                            onClick={() => setMobileOpen((v) => !v)}
                        >
                            {mobileOpen ? (
                                <LuX className="h-[26px] w-[26px] text-text-color" />
                            ) : (
                                <LuMenu className="h-[26px] w-[26px] text-text-color" />
                            )}
                        </div>
                    </div>
                </div>
                {/* Overlay menu */}
                {mobileOpen && (
                    <div className="fixed inset-0 z-40 bg-text-color-0 pt-[64px] p-6 overflow-y-auto">
                        <ul className="flex flex-col gap-6">
                            {[navigationLinks, accountLinks].map((links, gIndex) =>
                                links.map((link, lIndex) => {
                                    const { label, route, child_items, hasData } = link;
                                    const groupKey = `${gIndex}-${lIndex}`;
                                    const isExpanded = expandedGroups[groupKey];

                                    return (
                                        <li key={groupKey}>
                                            <div
                                                className="flex justify-between items-center text-lg font-medium cursor-pointer"
                                                onClick={() => {
                                                    if (child_items.length) {
                                                        setExpandedGroups((prev) => ({
                                                            ...prev,
                                                            [groupKey]: !prev[groupKey],
                                                        }));
                                                    }
                                                }}
                                            >
                                                {hasData ? (
                                                    <Link to={route}>{label}</Link>
                                                ) : (
                                                    <p>{label}</p>
                                                )}
                                                {child_items.length > 0 && (
                                                    <LuChevronDown
                                                        className={`transform transition-transform w-5 h-5 ${
                                                            isExpanded ? 'rotate-180' : ''
                                                        }`}
                                                    />
                                                )}
                                            </div>
                                            {isExpanded && child_items.length > 0 && (
                                                <ul className="mt-2 ml-4 flex flex-col gap-3 text-sm">
                                                    {child_items.map((child, i) => {
                                                        const { label, route, icon } = child;

                                                        return (
                                                            <li
                                                                key={i}
                                                                className="flex items-center gap-2 text-base"
                                                            >
                                                                {icon && (
                                                                    <Icon
                                                                        icon={icon}
                                                                        className="w-4 h-4 text-text-color"
                                                                    />
                                                                )}
                                                                <Link to={route}>{label}</Link>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            )}
                                        </li>
                                    );
                                })
                            )}
                        </ul>
                    </div>
                )}
            </nav>
        </>
    );
}
