import React, { useEffect, useState } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { Image } from '@uniwebcms/core-components';
import { FiAlertCircle } from 'react-icons/fi';
import { PiEmpty } from 'react-icons/pi';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import client from '../_utils/ajax';

const filterExperts = (experts, searchFaculty, searchLanguage, sort) => {
    const filtered = experts.filter((expert) => {
        const { caption, language, other_languages } = expert;

        let pass = true;

        if (searchFaculty && searchFaculty !== 'all') {
            pass = pass && caption.toLowerCase().includes(searchFaculty.toLowerCase());
        }

        if (searchLanguage && searchLanguage !== 'all') {
            if (searchLanguage === 'other_languages') {
                pass = pass && other_languages !== null && other_languages !== '';
            } else {
                pass = pass && language === searchLanguage;
            }
        }

        return pass;
    });

    if (!sort) {
        return filtered;
    }

    if (sort === 'asce') {
        return filtered.sort((a, b) => a.title.localeCompare(b.title));
    }
    if (sort === 'desc') {
        return filtered.sort((a, b) => b.title.localeCompare(a.title));
    }
};

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
    const searchFaculty = params.get('faculty') || '';
    const searchLanguage = params.get('lang') || '';
    const sort = params.get('sort') || '';

    const [headerHeight, setHeaderHeight] = useState(0);

    const {
        data: experts = [],
        error,
        loading = false,
    } = uniweb.useCompleteQuery(`getExperts_${searchText}`, async () => {
        const response = await client.get('experts.php', {
            params: {
                action: 'searchExperts',
                siteId: website.getSiteId(),
                query: searchText,
                lang: website.getLanguage(),
            },
        });
        return response.data.map((expert) => ({
            ...expert,
            title: expert.title.trim(),
        }));
    });

    useEffect(() => {
        const header = document.querySelector('header#expert_searching_header');
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
            className="@container flex flex-col items-center justify-center w-full "
            style={{ height: `${800 - headerHeight}px` }}
        >
            <div className="w-full max-w-6xl mx-auto pt-6 px-6 @xs:px-8 @md:px-12">
                <p className="text-base @2xl:text-xl text-text-color/60 uppercase">
                    <span>{filtered.length}</span>{' '}
                    {filtered.length === 1
                        ? website.localize({ en: 'expert found', fr: 'expert trouvé' })
                        : website.localize({ en: 'experts found', fr: 'experts trouvés' })}
                </p>
            </div>
            {filtered.length > 0 ? (
                <div className="w-full max-w-6xl mx-auto p-6 @xs:p-8 @md:p-12 h-full pt-2 @xs:pt-4 @md:pt-6">
                    <Virtuoso
                        height="100%"
                        components={{ Scroller: NoScrollbarScroller }}
                        data={filtered}
                        totalCount={filtered.length}
                        itemContent={(index, expert) => {
                            return (
                                <div key={index} className="pb-6">
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

    const splittedCaption = caption ? caption.split(',') : [];

    let unit, department;

    if (splittedCaption.length > 0) {
        if (splittedCaption.length === 1) {
            department = splittedCaption[0].trim();
        } else {
            department = splittedCaption.pop().trim();
            unit = splittedCaption.join(', ').trim();
        }
    }

    const handleClick = () => {
        const params = new URLSearchParams(location.search);
        params.set('id', content_id);
        const searchQuery = params.toString();
        navigate(`expert${searchQuery ? `?${searchQuery}` : ''}`);
    };

    return (
        <div
            className="bg-text-color-0 border border-text-color/10 overflow-hidden transition-all duration-300 shadow hover:shadow-md flex flex-col md:flex-row cursor-pointer rounded-[var(--border-radius)] group h-auto md:h-52"
            onClick={handleClick}
        >
            <div className="flex-shrink-0">
                <Image
                    profile={expertProfile}
                    type="avatar"
                    className="h-48 w-full object-cover md:w-52 md:h-52"
                />
            </div>
            <div className="p-6 flex flex-col justify-between">
                <div className="flex-grow">
                    <h3 className="text-xl font-bold text-primary-800">{title}</h3>
                    <p className="mt-1 text-base font-medium">
                        {position && <span>{position}</span>}
                        {position && unit ? ', ' : ''}
                        {unit && <span>{unit}</span>}
                    </p>
                    {department && <p className="mt-1 text-sm text-text-color/70">{department}</p>}
                    <div className="my-3 flex flex-wrap gap-2">
                        {expertise.slice(0, 3).map((tag) => (
                            <ExpertiseTag key={tag} className="max-w-44 truncate">
                                {tag}
                            </ExpertiseTag>
                        ))}
                        {expertise.length > 3 && (
                            <ExpertiseTag>
                                + {expertise.length - 3}{' '}
                                {website.localize({
                                    en: 'more',
                                    fr: 'de plus',
                                })}
                            </ExpertiseTag>
                        )}
                    </div>
                </div>
                <div>
                    <span className="text-sm font-semibold text-link-color group-hover:text-link-hover-color group-hover:underline">
                        {website.localize({
                            en: 'View Profile',
                            fr: 'Voir le profil',
                        })}{' '}
                        &rarr;
                    </span>
                </div>
            </div>
        </div>
    );
};

const ExpertiseTag = ({ children, className = '' }) => (
    <span
        className={`inline-block bg-text-color/5 text-text-color/90 rounded-full px-3 py-1 text-sm font-medium ${className}`}
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
        style={{ height: `${800 - headerHeight}px` }}
    >
        <div className="max-w-4xl mx-auto p-6 @xs:p-8 @md:p-12 text-center">
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
