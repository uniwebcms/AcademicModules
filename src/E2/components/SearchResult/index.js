import React, { memo } from 'react';
import { FiAlertCircle } from 'react-icons/fi';
import { Virtuoso } from 'react-virtuoso';
import { Image } from '@uniwebcms/core-components';
import { twJoin } from '@uniwebcms/module-sdk';

export default function SearchResult(props) {
    const { website, input } = props;

    const { useNavigate, useLocation } = website.getRoutingComponents();
    const navigate = useNavigate();
    const location = useLocation();

    const filteredResults = input.profiles || [];

    return (
        <React.Fragment>
            <p className="text-xl mb-6 text-text-color/80">
                {website.localize({
                    en: 'Showing ',
                    fr: 'Affichage de ',
                })}
                <span className="font-bold text-text-color">{filteredResults.length}</span>{' '}
                {filteredResults.length === 1
                    ? website.localize({ en: 'expert', fr: 'expert' })
                    : website.localize({ en: 'experts', fr: 'experts' })}{' '}
            </p>
            {filteredResults.length > 0 ? (
                <div>
                    <Virtuoso
                        useWindowScroll
                        data={filteredResults}
                        totalCount={filteredResults.length}
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
                <div className="text-center p-12 bg-text-color-0 shadow rounded-[var(--border-radius)] border border-text-color/20">
                    <FiAlertCircle className="h-12 w-12 text-text-color/80 mx-auto" />
                    <p className="mt-4 text-xl font-semibold text-heading-color">
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
            )}
        </React.Fragment>
    );
}

const ExpertCard = ({ expert, navigate, website, location }) => {
    const { head, title } = expert.getBasicInfo();

    const unit = head.academic_unit?.[1];
    const department = head.academic_unit?.[2];
    const position = head.position_title?.[1];
    const expertise = (expert.at('key_words') || []).map((item) => item.keyword);

    const handleClick = () => {
        const params = new URLSearchParams(location.search);
        params.set('id', expert.contentId);
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
                    profile={expert}
                    type="avatar"
                    className="h-48 w-full object-cover md:w-48 md:h-full"
                />
            </div>
            <div className="p-6 flex flex-col justify-between">
                <div>
                    <h3 className="text-xl font-bold">{title}</h3>
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
