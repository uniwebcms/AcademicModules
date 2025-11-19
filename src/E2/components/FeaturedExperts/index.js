import React from 'react';
import { Image } from '@uniwebcms/core-components';

export default function FeaturedExperts(props) {
    const { input, website } = props;

    const { useNavigate } = website.getRoutingComponents();

    const profiles = input.profiles || [];

    const navigate = useNavigate();

    return (
        <section className="mt-16">
            <h2 className="text-2xl font-bold">
                {website.localize({
                    en: 'Featured Experts',
                    fr: 'Experts en vedette',
                })}
            </h2>
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {profiles.map((expert) => (
                    <ExpertCard
                        key={expert.key}
                        website={website}
                        expert={expert}
                        navigate={navigate}
                    />
                ))}
            </div>
        </section>
    );
}

const ExpertCard = ({ website, expert, navigate }) => {
    const { head, title } = expert.getBasicInfo();

    const unit = head.academic_unit?.[1];
    const department = head.academic_unit?.[2];
    const position = head.position_title?.[1];
    const expertise = (expert.at('key_words') || []).map((item) => item.keyword);

    return (
        <div
            className="border border-text-color/10 overflow-hidden transition-all duration-300 shadow hover:shadow-md flex flex-col md:flex-row cursor-pointer rounded-[var(--border-radius)] group"
            onClick={() => {
                navigate(`expert?id=${expert.contentId}`);
            }}
        >
            <div className="flex-shrink-0">
                <Image
                    profile={expert}
                    type="avatar"
                    className="h-48 w-full object-cover md:w-48 md:h-full"
                />
            </div>
            <div className="p-6 flex flex-col justify-between flex-grow">
                <div>
                    <h3 className="text-xl font-bold text-primary-800">{title}</h3>
                    <p className="mt-1 text-base font-medium">
                        {position && <span>{position}, </span>}
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

const ExpertCardLoader = () => (
    <div className="border border-text-color/10 overflow-hidden shadow flex flex-col md:flex-row rounded-[var(--border-radius)]">
        {/* Skeleton for the Image */}
        <div className="flex-shrink-0 h-48 w-full md:w-56 md:h-full">
            <div className="w-full h-full bg-gray-300 animate-pulse"></div>
        </div>
        {/* Skeleton for the Content */}
        <div className="p-6 flex flex-col justify-between flex-grow w-full">
            <div className="animate-pulse">
                {/* title (h-7 is 28px) */}
                <div className="h-7 bg-gray-300 rounded w-3/4"></div>
                {/* position, unit (h-5 is 20px) */}
                <div className="h-5 bg-gray-300 rounded w-1/2 mt-2"></div>
                {/* department (h-4 is 16px) */}
                <div className="h-4 bg-gray-300 rounded w-1/3 mt-2"></div>

                {/* expertise tags (h-8 is 32px) */}
                <div className="mt-4 flex flex-wrap gap-2">
                    <div className="h-8 bg-gray-300 rounded-full w-20"></div>
                    <div className="h-8 bg-gray-300 rounded-full w-24"></div>
                    <div className="h-8 bg-gray-300 rounded-full w-16"></div>
                </div>
            </div>
            <div className="mt-4 animate-pulse">
                {/* Skeleton for the "View Profile" link (text-sm, font-semibold) */}
                <div className="h-4 bg-gray-300 rounded w-1/3"></div>
            </div>
        </div>
    </div>
);

FeaturedExperts.Loader = ({ block }) => {
    const { animation_loader_count = 0 } = block.getBlockProperties();

    return (
        <section className="mt-16">
            <h2 className="text-2xl font-bold">
                {block.website.localize({
                    en: 'Featured Experts',
                    fr: 'Experts en vedette',
                })}
            </h2>
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {animation_loader_count > 0 &&
                    Array.from({ length: animation_loader_count }).map((_, index) => (
                        <ExpertCardLoader key={index} />
                    ))}
            </div>
        </section>
    );
};
