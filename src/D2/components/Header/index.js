import React, { useState, useEffect } from 'react';
import { Icon, Link, twJoin, MediaIcon } from '@uniwebcms/module-sdk';
import { ThemeSelector } from './ThemeSelector';
import { getMediaLinkType } from '../_utils/media';
import LangSwitch from './LangSwitch';
import Search from './SiteSearch';

export default function Header(props) {
    const { block, website } = props;
    let [isScrolled, setIsScrolled] = useState(false);

    const { icons, links } = block.getBlockContent();

    const logo = icons[0];
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
                <div className="w-64 flex-shrink-0">
                    {logo ? (
                        <Link
                            to=""
                            title="A link back to the site's homepage"
                            className="block w-fit"
                        >
                            <Icon icon={logo} className="w-48" />
                        </Link>
                    ) : null}
                </div>
                <div>
                    <Search {...props} />
                </div>
                <div className="h-full w-64 flex-shrink-0 flex items-center justify-end gap-4 xl:gap-5">
                    <ThemeSelector className="relative z-10" />
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
