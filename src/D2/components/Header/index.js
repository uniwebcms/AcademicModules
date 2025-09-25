import React, { useState, useEffect } from 'react';
import { twJoin, getPageProfile } from '@uniwebcms/module-sdk';
import { MediaIcon, Image, Link } from '@uniwebcms/core-components';
import { ThemeSelector } from './ThemeSelector';
import { getMediaLinkType } from '../_utils/media';
import { useSidebar } from '../_utils/SidebarContext';
import LangSwitch from './LangSwitch';
import Search from './SiteSearch';

export default function Header(props) {
    const { block, website } = props;
    let [isScrolled, setIsScrolled] = useState(false);

    const { toggleSidebar } = useSidebar();

    // Add states for theme
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            return window.localStorage.getItem('theme') || 'system';
        }
        return 'system';
    });
    const [systemTheme, setSystemTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return 'light';
    });

    // Effect to handle system theme changes
    useEffect(() => {
        if (theme === 'system') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handler = (e) => {
                const newTheme = e.matches ? 'dark' : 'light';
                setSystemTheme(newTheme);
                document.documentElement.classList.toggle('dark', newTheme === 'dark');
            };
            mediaQuery.addEventListener('change', handler);
            return () => {
                mediaQuery.removeEventListener('change', handler);
            };
        }
    }, [theme]);

    const finalTheme = theme === 'system' ? systemTheme : theme;

    const { banner, images, links } = block.getBlockContent();
    const allImages = [banner, ...images].filter(Boolean);

    let logoImg = allImages.find((img) => {
        return img.caption === `logo-${finalTheme}`;
    });

    const mediaLinks = links.filter((link) => {
        const type = getMediaLinkType(link);
        if (type) {
            link.type = type;
            return true;
        }
        return false;
    });

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

    return (
        <div
            className={twJoin(
                'h-16 w-full max-w-screen z-50 transition duration-500 border-b border-slate-200 dark:border-slate-700/95',
                isScrolled
                    ? 'shadow-md border-none backdrop-blur bg-slate-50/75 dark:bg-slate-800/95 dark:[@supports(backdrop-filter:blur(0))]:bg-slate-900/75'
                    : 'bg-transparent'
            )}
        >
            <div className="h-full flex items-center justify-between max-w-[88rem] mx-auto px-6 md:px-8 lg:px-12 xl:px-0 xl:mx-[max(48px,calc((100vw-88rem)/2))] py-3">
                <div className="w-auto lg:w-64 flex-shrink-0 flex items-center justify-start">
                    <button
                        className="md:hidden p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none mr-2"
                        onClick={toggleSidebar}
                    >
                        <span className="sr-only">Toggle Sidebar</span>
                        <svg
                            className="h-6 w-6 text-slate-500 dark:text-slate-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16m-7 6h7"
                            />
                        </svg>
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
                <div className="hidden md:block">
                    <Search {...props} />
                </div>
                <div className="h-full w-auto lg:w-64 flex-shrink-0 flex items-center justify-end gap-4 xl:gap-5">
                    <div className="block md:hidden">
                        <Search {...props} />
                    </div>
                    <ThemeSelector className="relative z-10" {...{ theme, setTheme }} />
                    {mediaLinks.map((link, index) => {
                        return (
                            <Link key={index} to={website.makeHref(link.href)} target="_blank">
                                <span className="sr-only">{link.type}</span>
                                <MediaIcon
                                    type={link.type}
                                    className="h-5 w-5 text-slate-500 hover:text-slate-400 dark:text-slate-400 dark:hover:text-slate-300"
                                />
                            </Link>
                        );
                    })}
                    <LangSwitch website={website} />
                </div>
            </div>
        </div>
    );
}
