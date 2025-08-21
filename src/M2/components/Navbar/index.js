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

    const { sign_up_link = '' } = block.getBlockProperties();
    const { logo, linkGroups } = parseNavbarContent(block);

    const [mobileOpen, setMobileOpen] = useState(false);
    const [expandedGroups, setExpandedGroups] = useState({});

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
                    <ul className="flex gap-6 items-center w-full">
                        {linkGroups.map((links, gIndex) => {
                            return (
                                <React.Fragment key={gIndex}>
                                    {links.map((link, lIndex) => {
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
                                                key={lIndex}
                                                className={twJoin(
                                                    'group relative flex items-center',
                                                    lIndex === 0 && gIndex > 0 && 'ml-auto'
                                                )}
                                            >
                                                {child_items.length > 0 ? (
                                                    <DropdownMenu
                                                        trigger={element}
                                                        menuItems={child_items}
                                                        openFrom={gIndex === 0 ? 'left' : 'right'}
                                                        positionOffset={
                                                            gIndex === 0
                                                                ? lIndex + 1
                                                                : links.length - lIndex - 1
                                                        }
                                                    />
                                                ) : (
                                                    element
                                                )}
                                            </li>
                                        );
                                    })}
                                </React.Fragment>
                            );
                        })}
                        {sign_up_link && (
                            <li className={linkGroups.length < 2 ? 'ml-auto' : ''}>
                                <Link
                                    to={sign_up_link}
                                    target="_blank"
                                    className="block bg-btn-color text-btn-text-color hover:bg-btn-hover-color hover:text-btn-hover-text-color py-2 px-5 h-[44px] max-w-[105px] rounded-xl font-medium leading-[1.8]"
                                >
                                    {website.localize({
                                        en: 'Sign up',
                                        fr: "S'inscrire",
                                        es: 'Regístrate',
                                        zh: '注册',
                                    })}
                                </Link>
                            </li>
                        )}
                    </ul>
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
                            {linkGroups.map((links, gIndex) =>
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
                            {sign_up_link && (
                                <li onClick={() => setMobileOpen(false)}>
                                    <Link
                                        to={sign_up_link}
                                        target="_blank"
                                        className="block bg-btn-color text-btn-text-color hover:bg-btn-hover-color hover:text-btn-hover-text-color py-2 px-5 rounded-xl font-medium text-center"
                                    >
                                        {website.localize({
                                            en: 'Sign up',
                                            fr: "S'inscrire",
                                            es: 'Regístrate',
                                            zh: '注册',
                                        })}
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </div>
                )}
            </nav>
        </>
    );
}
