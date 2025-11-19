import React from 'react';
import { Virtuoso } from 'react-virtuoso';
import { Image } from '@uniwebcms/core-components';
import { FiAlertCircle } from 'react-icons/fi';
import { AiOutlineLoading } from 'react-icons/ai';
import client from '../_utils/ajax';

const filterExperts = (experts, searchTopic, searchFaculty, searchLanguage, sort) => {
    const filtered = experts.filter((expert) => {
        const { caption, keywords, language, other_languages } = expert;

        let pass = true;

        if (searchTopic && searchTopic !== 'all') {
            pass = pass && keywords.includes(searchTopic);
        }

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

    if (!sort || sort === 'relevance') {
        return filtered;
    }
    console.log('sort', sort);
    if (sort === 'name-asc') {
        return filtered.sort((a, b) => a.title.localeCompare(b.title));
    }
    if (sort === 'name-desc') {
        return filtered.sort((a, b) => b.title.localeCompare(a.title));
    }
};

export default function SearchResult(props) {
    const { website, input } = props;

    const { useNavigate, useLocation } = website.getRoutingComponents();
    const navigate = useNavigate();
    const location = useLocation();

    const params = new URLSearchParams(location.search);
    const searchText = params.get('search') || '';
    const searchTopic = params.get('topic') || '';
    const searchFaculty = params.get('faculty') || '';
    const searchLanguage = params.get('language') || '';
    const sort = params.get('sort') || '';

    const { data: experts, error } = uniweb.useCompleteQuery('getExperts', async () => {
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

    if (!experts) {
        return <Loading website={website} />;
    }

    if (error) {
        return <Error website={website} />;
    }

    const filtered = filterExperts(experts, searchTopic, searchFaculty, searchLanguage, sort);

    return (
        <React.Fragment>
            <p className="text-xl mb-6 text-text-color/80">
                {website.localize({
                    en: 'Showing ',
                    fr: 'Affichage de ',
                })}
                <span className="font-bold text-text-color">{filtered.length}</span>{' '}
                {filtered.length === 1
                    ? website.localize({ en: 'expert', fr: 'expert' })
                    : website.localize({ en: 'experts', fr: 'experts' })}{' '}
            </p>
            {filtered.length > 0 ? (
                <div>
                    <Virtuoso
                        useWindowScroll
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
            ) : (
                <NoResults website={website} />
            )}
        </React.Fragment>
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
            className="bg-text-color-0 border border-text-color/10 overflow-hidden transition-all duration-300 shadow hover:shadow-md flex flex-col md:flex-row cursor-pointer rounded-[var(--border-radius)] group"
            onClick={handleClick}
        >
            <div className="flex-shrink-0">
                <Image
                    profile={expertProfile}
                    type="avatar"
                    className="h-48 w-full object-cover md:w-48 md:h-full"
                />
            </div>
            <div className="p-6 flex flex-col justify-between">
                <div>
                    <h3 className="text-xl font-bold text-primary-800">{title}</h3>
                    <p className="mt-1 text-base font-medium">
                        {position && <span>{position}</span>}
                        {position && unit ? ', ' : ''}
                        {unit && <span>{unit}</span>}
                    </p>
                    {department && <p className="mt-1 text-sm text-text-color/70">{department}</p>}
                    <div className="mt-4 flex flex-wrap gap-2">
                        {expertise.slice(0, 3).map((tag) => (
                            <ExpertiseTag key={tag}>{tag}</ExpertiseTag>
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
                <div className="mt-4">
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

const ExpertiseTag = ({ children }) => (
    <span className="inline-block bg-text-color/5 text-text-color/90 rounded-full px-3 py-1 text-sm font-medium">
        {children}
    </span>
);

const Error = ({ website }) => (
    <div className="text-center p-12 bg-text-color-0 shadow rounded-[var(--border-radius)] border border-text-color/20">
        <FiAlertCircle className="h-12 w-12 text-text-color/80 mx-auto" />
        <p className="mt-4 text-xl font-semibold text-heading-color">
            {website.localize({
                en: 'Error occurred while fetching experts',
                fr: 'Erreur lors de la récupération des experts',
            })}
        </p>
        <p className="mt-2">
            {website.localize({
                en: 'Please try again later or contact support.',
                fr: 'Veuillez réessayer plus tard ou contacter le support.',
            })}
        </p>
    </div>
);

const Loading = ({ website }) => (
    <div className="text-center p-12 bg-text-color-0 shadow rounded-[var(--border-radius)] border border-text-color/20">
        <AiOutlineLoading className="h-12 w-12 text-text-color/80 mx-auto animate-spin" />
        <p className="mt-4 text-xl font-semibold text-heading-color">
            {website.localize({
                en: 'Loading experts...',
                fr: 'Chargement des experts...',
            })}
        </p>
        <p className="mt-2">
            {website.localize({
                en: 'This may take a moment, please wait.',
                fr: 'Cela peut prendre un moment, veuillez patienter.',
            })}
        </p>
    </div>
);

const NoResults = ({ website }) => (
    <div className="text-center p-12 bg-text-color-0 shadow rounded-[var(--border-radius)] border border-text-color/20">
        <FiAlertCircle className="h-12 w-12 text-text-color/80 mx-auto" />
        <p className="mt-4 text-xl font-semibold">
            {website.localize({
                en: 'No results found',
                fr: 'Aucun résultat trouvé',
            })}
        </p>
        <p className="mt-2">
            {website.localize({
                en: 'Try clearing your filters or searching for a different keyword.',
                fr: 'Essayez de supprimer vos filtres ou de rechercher un mot-clé différent.',
            })}
        </p>
    </div>
);
