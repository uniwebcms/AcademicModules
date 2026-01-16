import React, { useState } from 'react';
import Container from '../_utils/Container';
import { formatFlexibleDate } from '../_utils/date';
import { Profile, twJoin, stripTags } from '@uniwebcms/module-sdk';
import { Link, SafeHtml, Image } from '@uniwebcms/core-components';
import { LuArrowLeft, LuMapPin, LuCalendar, LuShare2 } from 'react-icons/lu';

export default function EventContent(props) {
    const { input, website, page } = props;
    const event = input.profile;

    const [copied, setCopied] = useState(false);

    if (!event) return null;

    let tag;

    const { title, head, banner } = event.getBasicInfo() || {};
    const { start_date, end_date, timezone, type } = head || {};

    if (type) {
        const [typeId, typeHead = {}] = type || [];
        const category = new Profile('category', typeId, {
            head: typeHead,
        });
        tag = category.getBasicInfo()?.title;
    }

    const startDate = formatFlexibleDate(start_date);
    const endDate = formatFlexibleDate(end_date);

    let date = startDate && endDate ? `${startDate} - ${endDate}` : startDate || endDate;

    if (date && timezone) {
        date += ` (${timezone})`;
    }

    const description = event.at('event_description/description');
    const organizers = event.at('organizers') || [];
    const speakers = event.at('speakers') || [];
    const topics =
        event.at('topics')?.map(
            ({ topic: t }) =>
                new Profile('topic', t[0], {
                    head: typeof t[1] === 'string' ? JSON.parse(t[1]) : t[1],
                }).getBasicInfo()?.title
        ) || [];
    const relatedEvents =
        event.at('related_events')?.map(
            ({ related_event: e }) =>
                new Profile('event', e[0], {
                    head: typeof e[1] === 'string' ? JSON.parse(e[1]) : e[1],
                }).getBasicInfo()?.title
        ) || [];
    const venue = event.at('location/venue_name');
    const address = event.at('location/address');

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
                            <div className="flex flex-wrap gap-4 text-sm 2xl:text-base text-text-color/80 mt-6 pt-6 border-t border-text-color/20">
                                {venue && (
                                    <div className="flex items-center gap-2">
                                        <LuMapPin className="w-4 h-4 2xl:w-5 2xl:h-5" />{' '}
                                        {address ? (
                                            <a
                                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                                    address.formatted_address
                                                )}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-current hover:text-link-hover-color transition-colors"
                                            >
                                                {venue}
                                            </a>
                                        ) : (
                                            <span>{venue}</span>
                                        )}
                                    </div>
                                )}
                                {date && (
                                    <div className="flex items-center gap-2">
                                        <LuCalendar className="w-4 h-4 2xl:w-5 2xl:h-5" /> {date}
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
                                    <SafeHtml
                                        value={description}
                                        className="leading-relaxed text-lg"
                                    />
                                </div>
                            )}
                            {organizers.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-bold border-b border-text-color/20 pb-2 mb-4">
                                        {website.localize({
                                            en: 'Organizers',
                                            fr: 'Organisateurs',
                                        })}
                                    </h3>
                                    <ul className="pt-1 grid lg:grid-cols-2 grid-col-1 gap-6">
                                        {organizers.map((org, i) => (
                                            <li
                                                key={i}
                                                className="flex flex-col gap-1 p-4 bg-text-color/5 rounded-[var(--border-radius)] border border-text-color/20"
                                            >
                                                <span className="text-primary-700 text-sm font-semibold">
                                                    {org.role}
                                                </span>
                                                <span className="text-base">{org.organizer}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {speakers.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-bold border-b border-text-color/20 pb-2 mb-4">
                                        {website.localize({
                                            en: 'Speakers',
                                            fr: 'Intervenants',
                                        })}
                                    </h3>
                                    <ul className="pt-1 grid lg:grid-cols-2 grid-col-1 gap-6">
                                        {speakers.map((spk, i) => (
                                            <li
                                                key={i}
                                                className="flex flex-col gap-1 p-4 bg-text-color/5 rounded-[var(--border-radius)] border border-text-color/20"
                                            >
                                                <span className="text-base text-heading-color">
                                                    {spk.speaker}
                                                </span>
                                                <span className="text-sm text-text-color/90">
                                                    {stripTags(spk.topic)}
                                                </span>
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
                                    profile={event}
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
                                    className="btn-secondary w-full flex items-center justify-between px-3 py-1.5 text-sm rounded-[var(--border-radius)] transition-colors ring-1 ring-btn-alt-text-color/20"
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
                        {/* Related Events */}
                        <div>
                            <h3 className="font-bold mb-3 text-sm uppercase tracking-wide">
                                {website.localize({
                                    en: 'Related Events',
                                    fr: 'Événements Connexes',
                                })}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {relatedEvents.map((tag) => (
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

EventContent.inputSchema = {
    type: 'event',
};
