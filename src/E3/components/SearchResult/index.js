import React, { useEffect, useState } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { Image } from '@uniwebcms/core-components';
import { FiAlertCircle } from 'react-icons/fi';
import { PiEmpty } from 'react-icons/pi';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { twMerge, twJoin } from '@uniwebcms/module-sdk';
import { filterExperts, parseAcademicUnit } from '../_utils/helper';
import client from '../_utils/ajax';

const NoScrollbarScroller = React.forwardRef((props, ref) => (
    <div {...props} ref={ref} className={`${props.className || ''} no-scrollbar`} />
));
NoScrollbarScroller.displayName = 'NoScrollbarScroller';

export default function SearchResult(props) {
    const { website } = props;

    const { useNavigate, useLocation } = website.getRoutingComponents();
    const navigate = useNavigate();
    const location = useLocation();

    const params = new URLSearchParams(location.search);
    const searchText = params.get('q') || '';
    const searchFaculty = params.get('faculty') || 'all';
    const searchLanguage = params.get('lang') || 'all';
    const sort = params.get('sort') || 'relevance';

    const [headerHeight, setHeaderHeight] = useState(0);

    const activeLang = website.getLanguage();

    const {
        data: experts = [],
        error,
        loading = false,
    } = uniweb.useCompleteQuery(`getExperts_${searchText}_${activeLang}`, async () => {
        const response = await client.get('experts.php', {
            params: {
                action: 'searchExperts',
                siteId: website.getSiteId(),
                query: searchText,
                activeLang,
            },
        });
        return response.data.map((expert) => ({
            ...expert,
            title: expert.title.trim(),
        }));
    });

    useEffect(() => {
        const header = document.querySelector('header#experts_searching_header');
        if (header) {
            setHeaderHeight(header.offsetHeight);
        }
    }, []);

    if (loading) {
        return <Loading website={website} headerHeight={headerHeight} />;
    }

    if (error) {
        return <Error website={website} headerHeight={headerHeight} />;
    }

    const filtered = filterExperts(experts, searchFaculty, searchLanguage, sort);

    if (filtered.length === 0) {
        return <NoResults website={website} headerHeight={headerHeight} />;
    }

    return (
        <div
            className="@container w-full"
            style={{ height: `calc(var(--container-height) - ${headerHeight}px)` }}
        >
            <div className="max-w-6xl mx-auto flex flex-col items-center justify-center h-full w-full p-3 @xl:p-4 @2xl:p-5">
                <div className="w-full mb-3 @lg:mb-4 @xl:mb-5">
                    <p className="text-base @2xl:text-xl text-text-color/60 uppercase">
                        <span>{filtered.length}</span>{' '}
                        {filtered.length === 1
                            ? website.localize({ en: 'expert found', fr: 'expert trouvé' })
                            : website.localize({ en: 'experts found', fr: 'experts trouvés' })}
                    </p>
                </div>
                {filtered.length > 0 ? (
                    <div className="w-full h-full">
                        <Virtuoso
                            height="100%"
                            components={{ Scroller: NoScrollbarScroller }}
                            data={filtered}
                            totalCount={filtered.length}
                            itemContent={(index, expert) => {
                                return (
                                    <div
                                        key={index}
                                        className={index < filtered.length - 1 ? 'pb-6' : ''}
                                    >
                                        <ExpertCard
                                            expert={expert}
                                            navigate={navigate}
                                            website={website}
                                            location={location}
                                        />
                                    </div>
                                );
                            }}
                        />
                    </div>
                ) : null}
            </div>
        </div>
    );
}

const ExpertCard = ({ expert, navigate, website, location }) => {
    const {
        avatar,
        caption,
        category: position,
        content_id,
        keywords: expertise = [],
        title,
    } = expert;

    const expertProfile = uniweb.newProfile('members', content_id, {
        head: { _avatar: avatar },
    });

    const { unit, faculty, institution } = parseAcademicUnit(caption);

    const handleClick = () => {
        const params = new URLSearchParams(location.search);
        params.set('id', content_id);
        const searchQuery = params.toString();
        navigate(`expert${searchQuery ? `?${searchQuery}` : ''}`);
    };

    return (
        <div
            className={twMerge(
                // Base: Vertical layout for small containers
                'bg-text-color-0 border border-text-color/10 overflow-hidden transition-all duration-300 shadow hover:shadow-md',
                'flex flex-col cursor-pointer rounded-[var(--border-radius)] group h-auto',
                // Large Containers: Switch to horizontal layout when width is > 672px (@2xl)
                '@2xl:flex-row @2xl:h-48'
            )}
            onClick={handleClick}
        >
            <div className="flex-shrink-0 overflow-hidden">
                <Image
                    profile={expertProfile}
                    type="avatar"
                    className={twJoin(
                        'h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105',
                        '@2xl:w-40 @2xl:h-40 @2xl:m-4 @2xl:rounded-full'
                    )}
                />
            </div>
            <div className="p-3 @xl:p-4 @2xl:p-5 flex flex-col justify-between flex-grow min-w-0">
                <div className="flex-grow">
                    <h3 className="text-xl @lg:text-2xl @2xl:text-3xl font-bold group-hover:underline">
                        {title}
                    </h3>
                    <div className="mt-1 text-sm @lg:text-base @2xl:text-lg font-medium text-text-color/90">
                        <p>{[position, unit].filter(Boolean).join(', ')}</p>
                    </div>
                    {faculty && (
                        <p className="mt-1 text-xs @lg:text-sm @2xl:text-base text-text-color/70">
                            {faculty}
                        </p>
                    )}

                    <div className="mt-4 flex flex-wrap gap-1.5">
                        {expertise.slice(0, 3).map((tag) => (
                            <ExpertiseTag
                                key={tag}
                                className="max-w-full @2xl:max-w-[120px] @4xl:max-w-[240px] @6xl:max-w-[320px] truncate"
                            >
                                {tag}
                            </ExpertiseTag>
                        ))}
                        {expertise.length > 3 && (
                            <ExpertiseTag className="bg-primary-50 text-primary-700">
                                +{expertise.length - 3}
                            </ExpertiseTag>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const ExpertiseTag = ({ children, className = '' }) => (
    <span
        className={`inline-block bg-text-color/5 text-text-color/90 rounded-[var(--border-radius)] px-3 py-1 text-xs @2xl:text-sm font-medium ${className}`}
    >
        {children}
    </span>
);

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
            en: 'Error occurred while fetching experts',
            fr: 'Erreur lors de la récupération des experts',
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
            en: 'Loading experts...',
            fr: 'Chargement des experts...',
        }}
        description={{
            en: 'This may take a moment, please wait.',
            fr: 'Cela peut prendre un moment, veuillez patienter.',
        }}
    />
);

const NoResults = (props) => (
    <StatusMessage
        {...props}
        icon={PiEmpty}
        iconClassName="text-text-color/80"
        title={{
            en: 'No results found',
            fr: 'Aucun résultat trouvé',
        }}
        description={{
            en: 'Try clearing your filters or searching for a different keyword.',
            fr: 'Essayez de supprimer vos filtres ou de rechercher un mot-clé différent.',
        }}
    />
);
