import React, { useState } from 'react';
import Container from '../_utils/Container';
import { formatFlexibleDate } from '../_utils/date';
import { Profile, twJoin } from '@uniwebcms/module-sdk';
import { Link, Image } from '@uniwebcms/core-components';
import { LuArrowLeft, LuShare2 } from 'react-icons/lu';
import { ExpandableText } from '../_utils/text';
import { getMediaIcon, getMediaHref } from '../_utils/media';
import { BeatLoader } from 'react-spinners';

export default function GroupContent(props) {
    const { input, website, page } = props;
    const group = input.profile;

    const [copied, setCopied] = useState(false);

    if (!group) return null;

    const { title, banner, head = {} } = group.getBasicInfo() || {};
    const tag = head.type?.[1] || '';

    const description = group.at('group_description/description') || '';
    const socialMediaLinks = group.at('social_media_links') || [];
    const partnersAndCollaborators = group.at('partners_and_collaborators') || [];
    const researchPlaces = group.at('research_places') || [];

    const topics =
        group
            .at('topics')
            ?.map(({ topic: t }) =>
                t
                    ? new Profile('topic', t[0], {
                          head: typeof t[1] === 'string' ? JSON.parse(t[1]) : t[1],
                      }).getBasicInfo()?.title
                    : ''
            )
            .filter(Boolean) || [];
    const subGroups =
        group
            .at('sub_groups')
            ?.map(({ group: g }) =>
                g
                    ? new Profile('groups', g[0], {
                          head: typeof g[1] === 'string' ? JSON.parse(g[1]) : g[1],
                      }).getBasicInfo()?.title
                    : ''
            )
            .filter(Boolean) || [];

    const isDynamicPage = page.activeRoute.includes('[id]');

    const handleShare = (e) => {
        e.preventDefault();

        // copy current URL to clipboard
        navigator.clipboard
            .writeText(window.location.href)
            .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
            })
            .catch((err) => {
                console.error('Failed to copy: ', err);
            });
    };

    return (
        <Container className="animate-in slide-in-from-right-8 duration-300">
            <div className="w-full px-4 xs:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
                {isDynamicPage && (
                    <Link
                        to={input.makeHrefToIndex()}
                        className="mb-6 text-text-color/70 hover:text-text-color flex items-center gap-2 text-sm font-medium transition-colors"
                    >
                        <LuArrowLeft className="w-4 h-4" />{' '}
                        {website.localize({ en: 'Back to list', fr: 'Retour à la liste' })}
                    </Link>
                )}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content Column */}
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                {tag && <Badge variant="primary">{tag}</Badge>}
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                                {title}
                            </h1>

                            {/* Meta Row */}
                            <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-text-color/20">
                                {socialMediaLinks.length > 0 && (
                                    <div className="flex items-center gap-4">
                                        {socialMediaLinks.map((link, index) => (
                                            <Link
                                                key={index}
                                                to={getMediaHref(link)}
                                                className="text-text-color/80 hover:text-link-hover-color transition-colors duration-200"
                                                aria-label={link.website_type}
                                                title={link.website_type}
                                            >
                                                {getMediaIcon(link)}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Body Content */}
                        <div className="space-y-8">
                            {description && (
                                <div>
                                    <h3 className="text-lg font-bold border-b border-text-color/20 pb-2 mb-4">
                                        {website.localize({ en: 'Description', fr: 'Description' })}
                                    </h3>
                                    <ExpandableText text={description} website={website} />
                                </div>
                            )}
                            {partnersAndCollaborators.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-bold border-b border-text-color/20 pb-2 mb-4">
                                        {website.localize({
                                            en: 'Partners & Collaborators',
                                            fr: 'Partenaires et Collaborateurs',
                                        })}
                                    </h3>
                                    <ul className="pt-1 grid lg:grid-cols-2 grid-col-1 gap-6">
                                        {partnersAndCollaborators.map((pc, i) => (
                                            <li
                                                key={i}
                                                className="flex flex-col gap-1 p-4 bg-text-color/5 rounded-[var(--border-radius)] border border-text-color/20"
                                            >
                                                <span className="text-primary-700 text-sm font-semibold">
                                                    {pc.role}
                                                </span>
                                                <span>
                                                    {[pc.first_name, pc.last_name].join(' ')}
                                                </span>
                                                <span className="text-sm text-text-color/80">
                                                    {pc.organization}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {researchPlaces.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-bold border-b border-text-color/20 pb-2 mb-4">
                                        {website.localize({
                                            en: 'Research Places',
                                            fr: 'Lieux de Recherche',
                                        })}
                                    </h3>
                                    <ul className="pt-1 grid lg:grid-cols-2 grid-col-1 gap-6">
                                        {researchPlaces.map((rp, i) => (
                                            <li
                                                key={i}
                                                className="flex flex-col gap-1 p-4 bg-text-color/5 rounded-[var(--border-radius)] border border-text-color/20"
                                            >
                                                <span className="h-5 text-primary-700 text-sm font-semibold">
                                                    {rp.activity_types
                                                        ?.map((a) => a.activity_type)
                                                        ?.filter(Boolean)
                                                        ?.join(', ')}
                                                </span>
                                                <p>{rp.address?.formatted_address}</p>
                                                <p className="text-sm text-text-color/80">
                                                    {[
                                                        formatFlexibleDate(rp.start_date),
                                                        formatFlexibleDate(rp.end_date),
                                                    ]
                                                        .filter(Boolean)
                                                        .join(' - ')}
                                                </p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar Column */}
                    <div className="lg:max-w-[320px] ml-0 lg:ml-auto space-y-6">
                        {banner && (
                            <div className="rounded-[var(--border-radius)] overflow-hidden border border-text-color/20 shadow-sm">
                                <Image
                                    profile={group}
                                    type="banner"
                                    className="w-full h-auto object-cover"
                                />
                            </div>
                        )}

                        {/* Action Card */}
                        <div className="bg-text-color/5 p-6 rounded-[var(--border-radius)] border border-text-color/20">
                            <h3 className="font-bold  mb-4">
                                {website.localize({
                                    en: 'Actions & Resources',
                                    fr: 'Actions et Ressources',
                                })}
                            </h3>
                            <div className="space-y-3">
                                <button
                                    onClick={handleShare}
                                    className="bg-text-color-0 text-text-color/80 hover:text-link-color hover:bg-text-color-0 border border-text-color/20 hover:border-link-color/60 hover:shadow w-full flex items-center justify-between px-3 py-1.5 text-sm rounded-[var(--border-radius)] transition-all"
                                >
                                    <LuShare2 className="w-4 h-4" />
                                    <span className={copied ? 'text-accent-500' : ''}>
                                        {copied
                                            ? website.localize({
                                                  en: 'Link copied!',
                                                  fr: 'Lien copié !',
                                              })
                                            : website.localize({
                                                  en: 'Share',
                                                  fr: 'Partager',
                                              })}
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* Related Topics */}
                        <div>
                            <h3 className="font-bold mb-3 text-sm uppercase tracking-wide">
                                {website.localize({ en: 'Related Topics', fr: 'Sujets Connexes' })}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {topics.map((tag) => (
                                    <Badge key={tag}>{tag}</Badge>
                                ))}
                            </div>
                        </div>
                        {/* Sub groups */}
                        <div>
                            <h3 className="font-bold mb-3 text-sm uppercase tracking-wide">
                                {website.localize({
                                    en: 'Sub Groups',
                                    fr: 'Sous-groupes',
                                })}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {subGroups.map((tag) => (
                                    <Badge key={tag}>{tag}</Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
}

const Badge = ({ children, variant = 'neutral', className }) => {
    const variants = {
        neutral: 'bg-text-color/10 text-text-color',
        primary: 'bg-primary-100 text-primary-800',
    };
    return (
        <span
            className={twJoin(
                'px-2.5 py-0.5 rounded-[var(--border-radius)] text-xs 2xl:text-sm font-medium',
                variants[variant],
                className
            )}
        >
            {children}
        </span>
    );
};

GroupContent.Loader = ({ block }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[600px] text-center p-4">
            <BeatLoader
                color="rgba(var(--primary-700) / 1.00)"
                aria-label="Loading"
                size={12}
                margin={4}
            />
            <p className="mt-4 text-text-color text-lg lg:text-2xl">
                {block.website.localize({
                    en: 'Loading group content...',
                    fr: 'Chargement du contenu du groupe...',
                })}
            </p>
            <p className="mt-1 text-text-color/70 text-sm lg:text-lg">
                {block.website.localize({
                    en: 'This should only take a few seconds.',
                    fr: 'Cela ne devrait prendre que quelques secondes.',
                })}
            </p>
        </div>
    );
};

GroupContent.inputSchema = {
    type: 'groups',
};
