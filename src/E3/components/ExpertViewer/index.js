import React, { useState, useEffect, useRef } from 'react';
import { FiAlertCircle } from 'react-icons/fi';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { Image, SafeHtml } from '@uniwebcms/core-components';
import { Profile, stripTags } from '@uniwebcms/module-sdk';
import { parseAcademicUnit, joinWithComma, formatDateRange } from '../_utils/helper';
import { formatPhone, parsePhoneParts, toTelHref } from '../_utils/phone';
import {
    LuUser,
    LuMail,
    LuStar,
    LuMapPin,
    LuBookOpen,
    LuPhone,
    LuGlobe,
    LuExternalLink,
    LuAward,
    LuChevronUp,
    LuChevronDown,
    LuBuilding2,
} from 'react-icons/lu';
import client from '../_utils/ajax';
import { parseReference } from '../_utils/reference';

const getValidPublications = (publications) => {
    return publications.filter(({ reference }) => {
        if (!reference || !Array.isArray(reference) || reference.length < 1) return false;

        let [id, head] = reference;

        head = typeof head === 'string' ? JSON.parse(head) : head;
        if (!head?.data) return false;

        return !!head.title;
    });
};

export default function ExpertViewer(props) {
    const { website, block } = props;
    const { hide_empty = false } = block.getBlockProperties();

    const { useLocation } = website.getRoutingComponents();
    const location = useLocation();

    const [headerHeight, setHeaderHeight] = useState(0);

    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('id');

    const activeLang = website.getLanguage();

    const {
        data: response = {},
        error,
        loading = false,
    } = uniweb.useCompleteQuery(`getExpert_${id}_${activeLang}`, async () => {
        const response = await client.get('experts.php', {
            params: {
                action: 'getExpert',
                siteId: website.getSiteId(),
                memberId: id,
                activeLang,
            },
        });
        return response.data;
    });

    useEffect(() => {
        const header = document.querySelector('header#expert_viewer_header');
        if (header) {
            setHeaderHeight(header.offsetHeight);
        }
    }, []);

    if (error || (!loading && !response.data)) {
        return <Error website={website} headerHeight={headerHeight} />;
    }

    if (loading) {
        return <Loading website={website} headerHeight={headerHeight} />;
    }

    const expert = new Profile('members', id, { data: response.data });

    const { head = {}, title, subtitle } = expert.getBasicInfo() || {};
    const { unit, faculty } = parseAcademicUnit(subtitle);

    const {
        academic_unit = [],
        position_title = [],
        email = '',
        telephone = '',
        homepage = '',
        office = '',
    } = head;

    const position = position_title?.[1];
    const unitId = academic_unit?.[0];

    const selectedDegrees = expert.at('selected_degrees') || [];
    const biography = expert.at('biography/academic_biography') || '';
    // const areasOfExpertise = expert.at('key_words')?.map((item) => item.keyword) || [];
    const researchInterests = expert.at('topics');
    const publications = getValidPublications(expert.at('references') || []);
    const contact_preferences = expert.at('contact_preferences') || {};
    const {
        email: emailContact = '0',
        telephone: telContact = '0',
        office: officeContact = '0',
    } = contact_preferences;

    const renderTopic = (topic) => {
        let [id, head] = topic.topic;

        head = typeof head === 'string' ? JSON.parse(head) : head;
        if (!head) return null;

        const topicProfile = new Profile('topic', id, { head });
        const { title } = topicProfile.getBasicInfo() || {};

        return (
            <span className="px-4 py-2 bg-text-color/5 rounded-[var(--border-radius)] text-xs @2xl:text-sm font-medium">
                {title}
            </span>
        );
    };

    const renderPublication = (publication) => {
        let [id, head] = publication.reference;

        head = typeof head === 'string' ? JSON.parse(head) : head;
        if (!head?.data) return null;

        const reference = new Profile('reference', id, {
            head,
        });

        const { title, issued, 'container-title': containerTitle } = parseReference(reference);

        return (
            <li className="group">
                <p className="text-sm @2xl:text-base font-semibold text-heading-color">{title}</p>
                <p className="text-xs @2xl:text-sm text-text-color/70">
                    {joinWithComma(containerTitle, issued?.['date-parts']?.[0]?.[0])}
                </p>
            </li>
        );
    };

    return (
        <div className={'@container w-full'}>
            <div
                className="w-full max-w-6xl mx-auto flex flex-col @4xl:flex-row gap-10 @4xl:gap-12 p-3 @xl:p-4 @2xl:p-5 @4xl:p-0 overflow-y-auto no-scrollbar"
                style={{ height: `calc(var(--container-height) - ${headerHeight}px)` }}
            >
                {/* Left Sidebar - Quick Info */}
                <div className="w-full @4xl:w-1/3 @4xl:pl-5 @4xl:py-5 space-y-8 @4xl:sticky top-0 @4xl:max-h-full @4xl:overflow-y-auto no-scrollbar">
                    {/* Avatar & Key Info */}
                    <div className="text-center @4xl:text-left pt-4 @4xl:pt-0">
                        <Image
                            profile={expert}
                            type="avatar"
                            rounded
                            className="w-40 h-40 mb-6 mx-auto @4xl:mx-0"
                        />
                        <h2 className="text-2xl @4xl:text-3xl font-bold mb-2">{title}</h2>
                        <p className="text-base @4xl:text-lg font-semibold text-[var(--highlight)]">
                            {position}
                        </p>
                        <p className="text-sm @4xl:text-base text-text-color/90 font-medium">
                            {faculty}
                        </p>
                        <p className="text-xs @4xl:text-sm text-text-color/70">{unit}</p>
                    </div>

                    <hr className="border-text-color/10" />

                    {/* Contact Info */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-wider">
                            {website.localize({ en: 'Contact', fr: 'Contact' })}
                        </h3>
                        <div className="space-y-3 text-sm">
                            {emailContact === '1' && <Email email={email} />}
                            {telContact === '1' && <Phone phone={telephone} />}
                            {officeContact === '1' && <Office office={office} />}
                            <WebsiteLink url={homepage} />
                            <UnitLink unitId={unitId} website={website} />
                        </div>
                    </div>

                    {/* Education */}
                    {(!hide_empty || (hide_empty && selectedDegrees.length > 0)) && (
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold uppercase tracking-wider">
                                {website.localize({ en: 'Education', fr: 'Éducation' })}
                            </h3>
                            <ul className="space-y-2 text-sm">
                                {selectedDegrees.map(
                                    ({ degree_name, specialty, institution, year }, i) => (
                                        <li key={i} className="flex gap-2">
                                            <LuAward className="h-4 w-4 flex-shrink-0 mt-0.5" />
                                            <p>
                                                {[degree_name, specialty, institution]
                                                    .filter(Boolean)
                                                    .join(', ')}
                                                {year ? ` (${year})` : ''}
                                            </p>
                                        </li>
                                    )
                                )}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Right Content - Main Info */}
                <div className="w-full @4xl:w-2/3 @4xl:pr-5 @4xl:py-5 space-y-8 @4xl:max-h-full @4xl:overflow-y-auto no-scrollbar">
                    {/* Bio */}
                    {(!hide_empty || (hide_empty && biography)) && (
                        <section>
                            <h3 className="text-xl @4xl:text-2xl font-bold mb-4 border-b border-text-color/10 pb-2 flex items-center gap-2">
                                <LuUser className="text-xl @4xl:text-2xl" />
                                {website.localize({ en: 'Biography', fr: 'Biographie' })}
                            </h3>
                            <ExpandableText text={biography} website={website} />
                        </section>
                    )}

                    {/* Research Interests */}
                    {(!hide_empty || (hide_empty && researchInterests.length > 0)) && (
                        <section>
                            <h3 className="text-xl @4xl:text-2xl font-bold mb-4 border-b border-text-color/10 pb-2 flex items-center gap-2">
                                <LuStar className="text-xl @4xl:text-2xl" />
                                {website.localize({
                                    en: 'Research Interests',
                                    fr: 'Int\u00e9r\u00eats de recherche',
                                })}
                            </h3>

                            <ExpandableTile
                                items={researchInterests}
                                renderItem={renderTopic}
                                website={website}
                            />
                        </section>
                    )}

                    {/* Publications */}
                    {(!hide_empty || (hide_empty && publications.length > 0)) && (
                        <section>
                            <h3 className="text-xl @4xl:text-2xl font-bold mb-4 border-b border-text-color/10 pb-2 flex items-center gap-2">
                                <LuBookOpen className="text-xl @4xl:text-2xl" />
                                {website.localize({
                                    en: 'Selected Publications',
                                    fr: 'Publications Sélectionnées',
                                })}
                            </h3>
                            <ExpandableList
                                items={publications}
                                initialCount={5}
                                renderItem={renderPublication}
                                website={website}
                            />
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
}

const Email = ({ email }) => {
    if (!email) return null;

    return (
        <div className="flex items-center gap-3">
            <LuMail className="h-4 w-4 shrink-0" />
            <a href={`mailto:${email}`} className="hover:underline">
                {email}
            </a>
        </div>
    );
};

const Phone = ({ phone }) => {
    if (!phone) return null;

    const parsed = parsePhoneParts(phone);

    if (!parsed || parsed.raw) {
        return (
            <div className="flex items-center gap-3">
                <LuPhone className="h-4 w-4 shrink-0" />
                <span>{parsed?.raw ?? phone}</span>
            </div>
        );
    }

    const display = formatPhone(parsed);
    const href = toTelHref(parsed);

    const phoneElement = href ? (
        <a href={href} className="hover:underline">
            {display}
        </a>
    ) : (
        <span>{display}</span>
    );

    return (
        <div className="flex items-center gap-3">
            <LuPhone className="h-4 w-4 shrink-0" />
            {phoneElement}
        </div>
    );
};

const Office = ({ office }) => {
    if (!office) return null;

    return (
        <div className="flex items-center gap-3">
            <LuBuilding2 className="h-4 w-4 shrink-0" />
            <span>{office}</span>
        </div>
    );
};

const WebsiteLink = ({ url }) => {
    if (!url) return null;

    return (
        <div className="flex items-center gap-3">
            <LuGlobe className="h-4 w-4 shrink-0" />
            <a href={url} target="_blank" rel="noreferrer" className="hover:underline">
                {url}
            </a>
        </div>
    );
};

const UnitLink = ({ website, unitId }) => {
    if (!unitId) return null;

    const appDomain = uniweb.getAppDomain();

    return (
        <div className="flex items-center gap-3">
            <LuExternalLink className="h-4 w-4 shrink-0" />
            <a
                href={`${appDomain}network/profile/units/${unitId}`}
                className="hover:underline"
                target="_blank"
                rel="noreferrer"
            >
                {website.localize({
                    en: 'View full faculty profile',
                    fr: 'Voir le profil complet de la faculté',
                })}
            </a>
        </div>
    );
};

const StatusMessage = ({
    website,
    headerHeight = 0,
    icon: Icon,
    iconClassName = '',
    title,
    description,
}) => (
    <div
        className="@container bg-text-color/5 flex items-center justify-center"
        style={{ height: `calc(var(--container-height) - ${headerHeight}px)` }}
    >
        <div className="max-w-4xl mx-auto p-3 @md:p-6 @lg:p-9 @2xl:p-12 text-center">
            <Icon className={`h-12 w-12 @lg:w-16 @lg:h-16 mx-auto ${iconClassName}`} />
            <p className="mt-4 @lg:mt-6 text-xl @xs:text-2xl @2xl:text-3xl @4xl:text-4xl font-semibold text-heading-color">
                {website.localize(title)}
            </p>
            <p className="mt-2 @lg:mt-3 text-sm @xs:text-base @2xl:text-lg text-text-color/70">
                {website.localize(description)}
            </p>
        </div>
    </div>
);

const Error = (props) => (
    <StatusMessage
        {...props}
        icon={FiAlertCircle}
        iconClassName="text-text-color/80"
        title={{
            en: 'Error occurred while fetching expert data',
            fr: "Une erreur est survenue lors de la récupération des données de l'expert",
        }}
        description={{
            en: 'Please try again later or contact support.',
            fr: 'Veuillez réessayer plus tard ou contacter le support.',
        }}
    />
);

const Loading = (props) => (
    <StatusMessage
        {...props}
        icon={AiOutlineLoading3Quarters}
        iconClassName="text-text-color/70 animate-spin"
        title={{
            en: 'Loading expert data...',
            fr: "Chargement des données de l'expert...",
        }}
        description={{
            en: 'This may take a few seconds, please wait.',
            fr: 'Cela peut prendre quelques secondes, veuillez patienter.',
        }}
    />
);

const ExpandableText = ({ text, className = '', website }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    // Simple heuristic: if text is short enough, don't truncate
    // Ideally we'd measure height, but line clamping is CSS-based
    // We'll assume if it's under 300 chars it probably fits in 3 lines (rough estimate)
    const shouldTruncate = stripTags(text).length > 300;

    if (!shouldTruncate) {
        return (
            <SafeHtml
                className={`leading-relaxed text-base @4xl:text-lg [&>p+p]:mt-2 @4xl:[&>p+p]:mt-3 ${className}`}
                value={text}
            />
        );
    }

    return (
        <div className={className}>
            <SafeHtml
                className={`leading-relaxed text-base @4xl:text-lg [&>p+p]:mt-2 @4xl:[&>p+p]:mt-3 transition-all duration-300 ${
                    !isExpanded ? 'line-clamp-3' : ''
                }`}
                value={text}
            />
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-2 text-[var(--highlight)] font-medium text-sm flex items-center hover:underline focus:outline-none"
            >
                {isExpanded ? (
                    <>
                        {website.localize({
                            en: 'Show Less',
                            fr: 'Voir Moins',
                        })}{' '}
                        <LuChevronUp className="ml-1 h-4 w-4" />
                    </>
                ) : (
                    <>
                        {website.localize({
                            en: 'Show More',
                            fr: 'Voir Plus',
                        })}{' '}
                        <LuChevronDown className="ml-1 h-4 w-4" />
                    </>
                )}
            </button>
        </div>
    );
};

const ExpandableTile = ({ items, maxRows = 3, website, renderItem }) => {
    const [showAll, setShowAll] = useState(false);
    const containerRef = useRef(null);
    const measureRef = useRef(null);
    const [visibleCount, setVisibleCount] = useState(items.length);

    const defaultRenderItem = (item) => (
        <span className="px-4 py-2 bg-text-color/5 rounded-[var(--border-radius)] text-xs @2xl:text-sm font-medium">
            {item}
        </span>
    );

    const itemRenderer = renderItem || defaultRenderItem;

    useEffect(() => {
        if (showAll) return;

        const container = containerRef.current;
        const measure = measureRef.current;
        if (!container || !measure || items.length === 0) return;

        const calculate = () => {
            const containerWidth = container.offsetWidth;
            const children = Array.from(measure.children);
            const gap = 8; // gap-2 = 0.5rem = 8px

            // Last child in measurement container is the "+x more" badge
            const badgeEl = children[children.length - 1];
            const badgeWidth = badgeEl.offsetWidth;

            // Item elements (excluding badge)
            const itemEls = children.slice(0, -1);

            // Group items into rows by offsetTop
            const rows = [];
            let currentRowTop = -1;

            for (let i = 0; i < itemEls.length; i++) {
                const el = itemEls[i];
                if (el.offsetTop !== currentRowTop) {
                    currentRowTop = el.offsetTop;
                    rows.push([]);
                }
                rows[rows.length - 1].push(i);
            }

            // All items fit within maxRows — show everything
            if (rows.length <= maxRows) {
                setVisibleCount(items.length);
                return;
            }

            // Count items in first maxRows rows
            let count = 0;
            for (let r = 0; r < maxRows; r++) {
                count += rows[r].length;
            }

            // Remove items from the end of the last visible row
            // until the "+x more" badge fits on that row
            while (count > 0) {
                const lastEl = itemEls[count - 1];
                const rightEdge = lastEl.offsetLeft + lastEl.offsetWidth;
                const availableSpace = containerWidth - rightEdge - gap;

                if (availableSpace >= badgeWidth) {
                    break;
                }
                count--;
            }

            setVisibleCount(Math.max(1, count));
        };

        const observer = new ResizeObserver(calculate);
        observer.observe(container);

        return () => observer.disconnect();
    }, [items, maxRows, showAll]);

    if (!items || items.length === 0) return null;

    const displayItems = showAll ? items : items.slice(0, visibleCount);
    const remainingItems = items.length - displayItems.length;

    return (
        <div className="relative">
            {/* Hidden measurement container — renders all items + badge to measure layout */}
            {!showAll && (
                <div
                    ref={measureRef}
                    aria-hidden="true"
                    className="flex flex-wrap gap-2 absolute invisible pointer-events-none top-0 left-0 right-0"
                >
                    {items.map((item, index) => (
                        <React.Fragment key={index}>{itemRenderer(item)}</React.Fragment>
                    ))}
                    <span className="px-4 py-2 rounded-[var(--border-radius)] bg-text-color/5 text-sm font-medium whitespace-nowrap">
                        +{items.length} {website.localize({ en: 'more', fr: 'de plus' })}
                    </span>
                </div>
            )}
            {/* Visible container */}
            <div ref={containerRef} className="flex flex-wrap gap-2">
                {displayItems.map((item, index) => (
                    <React.Fragment key={index}>{itemRenderer(item)}</React.Fragment>
                ))}
                {!showAll && remainingItems > 0 && (
                    <button
                        onClick={() => setShowAll(true)}
                        className="px-4 py-2 rounded-[var(--border-radius)] bg-text-color/5 text-[var(--highlight)] text-sm font-medium transition-colors focus:outline-none"
                    >
                        +{remainingItems}{' '}
                        {website.localize({
                            en: 'more',
                            fr: 'de plus',
                        })}
                    </button>
                )}
                {showAll && (
                    <button
                        onClick={() => setShowAll(false)}
                        className="px-2 py-2 text-sm font-medium transition-colors text-[var(--highlight)] hover:underline focus:outline-none"
                    >
                        {website.localize({
                            en: 'Show Less',
                            fr: 'Voir Moins',
                        })}
                    </button>
                )}
            </div>
        </div>
    );
};

const ExpandableList = ({ items, renderItem, initialCount = 3, className = '', website }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!items || items.length === 0) return null;

    const visibleItems = isExpanded ? items : items.slice(0, initialCount);
    const hasMore = items.length > initialCount;

    return (
        <div className={className}>
            <ul className="space-y-4">
                {visibleItems.map((item, index) => (
                    <React.Fragment key={index}>{renderItem(item)}</React.Fragment>
                ))}
            </ul>

            {hasMore && (
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="mt-4 text-[var(--highlight)] font-medium text-sm flex items-center hover:underline focus:outline-none"
                >
                    {isExpanded ? (
                        <>
                            {website.localize({
                                en: 'Show Less',
                                fr: 'Voir Moins',
                            })}{' '}
                            <LuChevronUp className="ml-1 h-4 w-4" />
                        </>
                    ) : (
                        <>
                            {website.localize({
                                en: 'Show All',
                                fr: 'Voir Tout',
                            })}{' '}
                            ({items.length}) <LuChevronDown className="ml-1 h-4 w-4" />
                        </>
                    )}
                </button>
            )}
        </div>
    );
};
