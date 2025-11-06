import React, { useState, useEffect } from 'react';
import { twJoin, getPageProfile, useSiteTheme } from '@uniwebcms/module-sdk';
import { Image, Link } from '@uniwebcms/core-components';
import { ThemeSelector } from './ThemeSelector';
import { useSidebar } from '../_utils/SidebarContext';
import { HiMiniBars3BottomLeft } from 'react-icons/hi2';
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

export default function Header(props) {
    const { block, website } = props;

    const {
        sticky = true,
        mode = 'full_width',
        search_position = 'center',
        transparency = true,
    } = block.getBlockProperties();

    const { banner, images, form } = block.getBlockContent();
    const allImages = [banner, ...images].filter(Boolean);

    let [isScrolled, setIsScrolled] = useState(false);
    const { toggleSidebar } = useSidebar();
    const { theme: finalTheme, setTheme, mode: themeMode } = useSiteTheme(true);

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
        return img.caption === `logo-${finalTheme}`;
    });

    const links = parseLinks(form); // parsed links

    const outerWrapperClass = ['h-16'];

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
        <div className={twJoin(...outerWrapperClass)}>
            <div
                className={twJoin(
                    'h-full flex items-center justify-between max-w-[88rem] mx-auto px-6 md:px-8 lg:px-12 py-3',
                    mode === 'full_width' ? 'xl:px-0 xl:mx-[max(48px,calc((100vw-88rem)/2))]' : ''
                )}
            >
                <div className="w-auto lg:w-64 flex-shrink-0 flex items-center justify-start">
                    <button
                        className="group md:hidden p-1 rounded-md hover:bg-text-color/10 focus:outline-none mr-2"
                        onClick={toggleSidebar}
                    >
                        <span className="sr-only">Toggle Sidebar</span>
                        <HiMiniBars3BottomLeft className="h-6 w-6 text-text-color/80 group-hover:text-text-color" />
                    </button>
                    {/* Logo Image */}
                    {logoImg ? (
                        <Link to="/">
                            <Image
                                profile={getPageProfile()}
                                {...logoImg}
                                className="h-10 w-auto"
                            />
                        </Link>
                    ) : null}
                </div>
                {search_position === 'center' ? (
                    <div className="hidden md:block">
                        <Search {...props} searchPosition={search_position} enableShortcut />
                    </div>
                ) : null}
                <div className="h-full w-auto lg:w-64 flex-shrink-0 flex items-center justify-end gap-4 xl:gap-5">
                    {/* placeholder for links, group links */}
                    <div
                        className={twJoin(
                            search_position === 'center' ? 'md:hidden block' : 'block'
                        )}
                    >
                        <Search {...props} enableShortcut={search_position !== 'center'} />
                    </div>
                    <ThemeSelector
                        className="relative z-10"
                        {...{ theme: themeMode, finalTheme, setTheme }}
                    />
                    <LangSwitch website={website} />
                </div>
            </div>
        </div>
    );
}
