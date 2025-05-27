import React from 'react';
import { getMediaLinkLabel, getMediaLinkType } from '../_utils/media';
import { Link, SafeHtml, getPageProfile, Image, MediaIcon } from '@uniwebcms/module-sdk';

export default function Footer(props) {
    const { block, website } = props;
    const { banner, images, links: mediaLinks, paragraphs: copyright } = block.getBlockContent();

    const logo = images[0];
    const navigation = block.getBlockLinks({ nested: true });

    const language = website.getLanguage();
    const languages = website.getLanguages().filter((lang) => lang.value !== language);

    return (
        <footer>
            <div className="relative min-[1400px]:rounded-t-2xl py-[100px] px-10 overflow-hidden max-w-[1400px] mx-auto">
                {banner && (
                    <div className="absolute inset-0 -z-10">
                        <Image
                            profile={getPageProfile()}
                            {...banner}
                            className="object-cover w-full h-full"
                        />
                    </div>
                )}
                <div className="flex flex-col lg:flex-row gap-x-6 gap-y-8">
                    <div className="w-full lg:w-1/3 flex flex-col gap-10 flex-shrink-0">
                        <div className="h-8 max-w-[130px]">
                            <Image profile={getPageProfile()} {...logo} className="w-full h-auto" />
                        </div>
                        <div className="flex flex-wrap gap-4">
                            {mediaLinks.map((link, index) => {
                                const { label, href } = link;

                                const type = getMediaLinkType(link);

                                if (!type) return null;

                                const linkTitle = {
                                    en: `${label || type} link of the main website`,
                                    fr: `Lien ${label || type} du site principal`,
                                };

                                return (
                                    <a
                                        key={index}
                                        className="block hover:scale-105 transition-all duration-200"
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title={website.localize(linkTitle)}
                                    >
                                        <span className="sr-only">{type}</span>
                                        <MediaIcon type={type} className="w-6 h-6" />
                                    </a>
                                );
                            })}
                        </div>
                        <SafeHtml value={copyright} className="text-xs text-[var(--callout)]" />
                        <div className="flex items-center gap-x-3">
                            {languages.map((lang, index) => {
                                return (
                                    <React.Fragment key={index}>
                                        <button
                                            key={index}
                                            onClick={() => {
                                                website.changeLanguage(lang.value);
                                            }}
                                            className="text-sm text-text-color/70 hover:text-text-color"
                                        >
                                            {lang.label}
                                        </button>
                                        {index < languages.length - 1 && (
                                            <span className="h-4 w-px bg-gradient-to-b from-transparent via-text-color to-transparent" />
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    </div>
                    <div className="block lg:hidden w-full h-px bg-gradient-to-r from-transparent via-text-color to-transparent opacity-75"></div>
                    <div className="w-full lg:w-2/3">
                        <div
                            className="grid gap-x-4 gap-y-8 text-sm"
                            style={{
                                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                            }}
                        >
                            {navigation.map((page, index) => {
                                let { label, route, hasData, child_items } = page;

                                route = route === '/' ? '' : route;

                                return (
                                    <div key={index}>
                                        <p className="mb-4">
                                            {hasData ? (
                                                <Link className="hover:underline" to={route}>
                                                    {label}
                                                </Link>
                                            ) : (
                                                <span>{label}</span>
                                            )}
                                        </p>
                                        <ul className="space-y-2 font-light">
                                            {child_items.map((child, index) => {
                                                const { label, route, hasData } = child;

                                                return (
                                                    <li key={index}>
                                                        {hasData ? (
                                                            <Link
                                                                className="hover:underline"
                                                                to={route}
                                                            >
                                                                {label}
                                                            </Link>
                                                        ) : (
                                                            <span>{label}</span>
                                                        )}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
