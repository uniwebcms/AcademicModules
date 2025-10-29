import React, { useState, useEffect } from 'react';
import { twJoin, getPageProfile } from '@uniwebcms/module-sdk';
import { MediaIcon, Image, Link } from '@uniwebcms/core-components';
import { ThemeSelector } from './ThemeSelector';
import { getMediaLinkType } from '../_utils/media';
import { useSidebar } from '../_utils/SidebarContext';
import { HiMiniBars3BottomLeft } from 'react-icons/hi2';
import LangSwitch from './LangSwitch';
import Search from './SiteSearch';

export default function Header(props) {
    const { block, website } = props;

    const {
        sticky = true,
        mode = 'full_width',
        search_position = 'center',
        transparency = true,
    } = block.getBlockProperties();

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

    const outerWrapperClass = ['h-16'];

    if (mode === 'full_width') {
        outerWrapperClass.push('w-full max-w-screen border-b border-text-color/20');
    } else {
        outerWrapperClass.push(
            'my-0 desktop:my-2 w-full max-w-screen desktop:max-w-8xl mx-auto border-b desktop:border border-text-color/20 desktop:rounded-lg !bg-text-color-5'
        );
    }

    if (sticky) {
        outerWrapperClass.push('transition duration-500');

        if (isScrolled) {
            outerWrapperClass.push('shadow-md border-none');
            if (transparency) {
                outerWrapperClass.push('backdrop-blur bg-transparent');
            } else {
                outerWrapperClass.push('bg-bg-color');
            }
        } else {
            outerWrapperClass.push('bg-bg-color');
        }
    }

    return (
        <div
            className={twJoin(...outerWrapperClass)}
            // className={twJoin(
            //     'h-16 w-full max-w-screen transition duration-500 border-b border-text-color/20',
            //     isScrolled ? 'shadow-md border-none backdrop-blur bg-transparent' : 'bg-bg-color'
            // )}
        >
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
                    <div
                        className={twJoin(
                            search_position === 'center' ? 'md:hidden block' : 'block'
                        )}
                    >
                        <Search {...props} enableShortcut={search_position !== 'center'} />
                    </div>
                    <ThemeSelector className="relative z-10" {...{ theme, setTheme }} />
                    {mediaLinks.map((link, index) => {
                        return (
                            <Link key={index} to={website.makeHref(link.href)} target="_blank">
                                <span className="sr-only">{link.type}</span>
                                <MediaIcon
                                    type={link.type}
                                    className="h-5 w-5 text-icon-color hover:text-icon-color/80 transition-colors duration-200"
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
