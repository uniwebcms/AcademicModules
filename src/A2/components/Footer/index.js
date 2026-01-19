import React from 'react';
import { twJoin, getPageProfile } from '@uniwebcms/module-sdk';
import { Link, Image, SafeHtml } from '@uniwebcms/core-components';
import {
    FaFacebookF,
    FaTwitter,
    FaInstagram,
    FaLinkedinIn,
    FaYoutube,
    FaTiktok,
    FaGlobe,
} from 'react-icons/fa';
import { HiGlobeAlt } from 'react-icons/hi2';
import { getMediaIcon } from '../_utils/media';

/**
 * Helper: Parse form links into Media Links and Regular Columns
 */
const parseFooterLinks = (form) => {
    if (!form?.length) return { mediaLinks: [], columnLinks: [], standaloneLinks: [] };

    const mediaLinks = [];
    const columnLinks = [];
    const standaloneLinks = [];

    form.forEach((item) => {
        const { type, label, href, group_links } = item;
        const hasChildren = group_links && group_links.length > 0;

        // It's a regular column/link
        if (type === 'group' && hasChildren) {
            columnLinks.push({
                label, // Heading
                href: href || '', // Heading might be clickable or just text
                links: group_links.map((sub) => ({
                    label: sub.label,
                    href: sub.href,
                })),
            });
        } else if (type === 'media' && !hasChildren) {
            // Media link with no children, treated as a standalone link
            mediaLinks.push({ label, href });
        } else {
            // Standalone link treated as one column with no leading link
            standaloneLinks.push({
                label,
                href,
            });
        }
    });

    return { mediaLinks, columnLinks, standaloneLinks };
};

/**
 * Helper: Get Social Icon based on HREF
 */
// const getSocialIcon = (url) => {
//     const lowerUrl = url.toLowerCase();
//     const iconClass = 'w-5 h-5';

//     if (lowerUrl.includes('facebook')) return <FaFacebookF className={iconClass} />;
//     if (lowerUrl.includes('twitter') || lowerUrl.includes('x.com'))
//         return <FaTwitter className={iconClass} />;
//     if (lowerUrl.includes('instagram')) return <FaInstagram className={iconClass} />;
//     if (lowerUrl.includes('linkedin')) return <FaLinkedinIn className={iconClass} />;
//     if (lowerUrl.includes('youtube')) return <FaYoutube className={iconClass} />;
//     if (lowerUrl.includes('tiktok')) return <FaTiktok className={iconClass} />;

//     // Generic fallback
//     return <FaGlobe className={iconClass} />;
// };

// Component for the Social Media Icons
const SocialIcon = ({ link }) => {
    return (
        <Link
            to={link.href}
            className="text-text-color hover:text-link-hover-color transition-colors duration-200 p-2 bg-text-color/5 hover:bg-text-color/10 rounded-full"
            aria-label={link.label}
            title={link.label}
        >
            {getMediaIcon({ website_type: link.label, url: link.href })}
        </Link>
    );
};

// Component for a Link Column
const LinkColumn = ({ group }) => {
    return (
        <div className="flex flex-col space-y-2">
            {/* Lead Link / Heading - Solid Color */}
            <div className="font-bold text-heading-color text-base">
                {group.href ? (
                    <Link
                        to={group.href}
                        className="text-current hover:text-link-hover-color hover:underline transition-colors"
                    >
                        {group.label}
                    </Link>
                ) : (
                    <span>{group.label}</span>
                )}
            </div>

            {/* Child Links */}
            {group.links?.length > 0 && (
                <ul className="space-y-2">
                    {group.links.map((link, i) => (
                        <li key={i}>
                            <Link
                                to={link.href}
                                className="text-sm text-text-color hover:text-link-hover-color hover:underline transition-colors duration-200"
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default function Footer(props) {
    const { block, page, website } = props;

    const { banner, images, title: logoText, form, paragraphs } = block.getBlockContent();

    // Determine Theme (Logic borrowed from Header for consistency)
    let finalTheme = block.themeName?.split('__')?.[1] || 'light';

    // Combine banner + images to find logo matching theme
    const allImages = [banner, ...images].filter(Boolean);
    let logoImg =
        allImages.find((img) => {
            return img.theme === finalTheme;
        }) ??
        allImages[0] ??
        null;

    // Parse Links
    const { mediaLinks, columnLinks, standaloneLinks } = parseFooterLinks(form);

    // Disclaimer Text
    const disclaimerText = paragraphs || [];

    const languages = website.getLanguages();
    const activeLanguage = website.getLanguage();

    return (
        <footer className={twJoin('w-full py-12 lg:py-16 border-t border-text-color/10')}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Top Section: Logo (1/4) + Links (3/4) */}
                <div className="flex flex-col lg:flex-row gap-12 mb-12">
                    {/* Left Column: Logo & Socials (Span 1) */}
                    <div className="w-full lg:w-[35%] space-y-6">
                        {/* Logo Area */}
                        <Link to="/" className="inline-block">
                            <div className="flex flex-wrap items-center gap-3">
                                {logoImg && (
                                    <Image
                                        className="h-10 w-auto object-contain rounded-[var(--border-radius)]"
                                        profile={getPageProfile()}
                                        {...logoImg}
                                    />
                                )}
                                {logoText && (
                                    <span className="text-xl font-bold text-heading-color">
                                        {logoText}
                                    </span>
                                )}
                            </div>
                        </Link>

                        {/* Social Media Icons */}
                        {mediaLinks.length > 0 && (
                            <div className="flex flex-wrap gap-3">
                                {mediaLinks.map((link, index) => (
                                    <SocialIcon key={index} link={link} />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Column: Link Grid (Span 3) */}
                    <div className="w-full lg:w-[65%]">
                        {(columnLinks.length > 0 || standaloneLinks.length > 0) && (
                            <div
                                className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 ${
                                    columnLinks.length > 3 ? 'lg:grid-cols-4' : ''
                                } gap-8`}
                            >
                                {columnLinks.map((group, index) => (
                                    <LinkColumn key={index} group={group} />
                                ))}
                                <LinkColumn
                                    group={{
                                        label: website.localize({
                                            en: 'More Links',
                                            fr: 'Plus de liens',
                                        }),
                                        links: standaloneLinks,
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-text-color/10 my-8"></div>

                {/* Bottom Section: Language (1/4) + Disclaimer (3/4) */}
                <div className="flex flex-col lg:flex-row gap-12 mb-12">
                    {/* Language Switcher Area */}
                    <div className="w-full lg:w-[35%]">
                        {languages.length > 0 && (
                            <div className="flex flex-col gap-3">
                                {languages.map((lang) =>
                                    lang.value !== activeLanguage ? (
                                        <div
                                            key={lang.value}
                                            onClick={() => website.changeLanguage(lang.value)}
                                            className="text-sm text-text-color hover:text-link-hover-color underline transition-colors duration-200 cursor-pointer"
                                        >
                                            {lang.label}
                                        </div>
                                    ) : (
                                        <span
                                            key={lang.value}
                                            className="text-sm text-text-color/60 cursor-not-allowed"
                                        >
                                            {lang.label}
                                        </span>
                                    )
                                )}
                            </div>
                        )}
                    </div>

                    {/* Disclaimer Text Area */}
                    <div className="w-full lg:w-[65%] text-sm text-text-color/80 space-y-4">
                        <SafeHtml value={disclaimerText} className="leading-relaxed [&>p+p]:mt-3" />
                        <p className="pt-2">
                            &copy; {new Date().getFullYear()} {logoText || 'Company Name'}.{' '}
                            {website.localize({
                                en: 'All rights reserved.',
                                fr: 'Tous droits réservés.',
                            })}
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
