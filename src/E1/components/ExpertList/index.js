import React, { useEffect } from 'react';
import { Image, Link } from '@uniwebcms/module-sdk';
import Expert from '../Expert';
import Breadcrumb from '../_utils/Breadcrumb';
import Navigation from '../_utils/Navigation';
import Filter from '../_utils/Filter';

const ExpertItem = ({ searchParams, profile, website }) => {
    const info = profile.getBasicInfo();
    const { title, subtitle = '' } = info;

    const p = subtitle.split(',');

    const position = p.shift();
    const unit = p.join(', ').trim();

    let params = { ...searchParams, expert: profile.options.fileId };

    let search = '';

    for (let i in params) search += search ? `&${i}=${params[i]}` : `?${i}=${params[i]}`;

    return (
        <li
            className={`relative pl-4 pr-6 py-5 hover:bg-gray-50 sm:py-6 sm:pl-6 lg:pl-8 xl:pl-6 cursor-pointer`}
        >
            <Link to={search} className={`hover:no-underline`}>
                <div className={`flex items-center justify-start`}>
                    <div className={`min-w-0 space-y-3`}>
                        <div className={`flex items-center px-5`}>
                            <div className={`flex-shrink-0`}>
                                <div className={`mx-auto w-20 h-20 rounded-full`}>
                                    <Image profile={profile} type="avatar" rounded={true}></Image>
                                </div>
                            </div>
                            <div className={`mt-0 pt-1 text-left ml-6`}>
                                <p className={`text-sm font-medium text-gray-600`}>{unit}</p>
                                <p className={`text-lg font-bold text-gray-900 sm:text-xl`}>
                                    {title}
                                </p>
                                <p className={`text-sm font-medium text-gray-600`}>{position}</p>
                            </div>
                        </div>
                    </div>

                    {/* Repo meta info */}
                    <div className={`hidden md:flex ml-auto items-center`}>
                        <div className={`flex flex-col flex-shrink-0 items-end space-y-3`}>
                            <p className={`flex items-center space-x-4`}>
                                <span
                                    className={`relative text-sm text-gray-500 hover:text-gray-900 font-medium cursor-pointer`}
                                >
                                    {website.localize({
                                        en: 'View profile',
                                        fr: 'Voir le profil',
                                    })}
                                </span>
                            </p>
                        </div>
                        <svg
                            className={`h-5 w-5 text-gray-400`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path
                                fillRule="evenodd"
                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                </div>
            </Link>
        </li>
    );
};

export default function ({ input, website, block }) {
    const folder = input.profile.folder;

    const { useParams, useLocation } = website.getRoutingComponents();

    const params = useParams();

    const activeId = params['*'];

    const query = new URLSearchParams(useLocation().search);

    const activeExpert = query.get('expert') || '';

    const queryText = query.get('query') || '';

    const experts = folder.search(queryText, {
        type: 'members',
        subFolder: activeId,
    });

    const searchParams = {};
    for (let pair of query.entries()) {
        searchParams[pair[0]] = pair[1];
    }

    const [filter, setFilter] = React.useState({});

    useEffect(() => {
        setFilter({});
    }, [activeId, queryText]);

    const filteredExperts = experts.filter((expert) => {
        const head = expert.getBasicInfo().head;
        const unit = head.academic_unit?.[0];
        const position = head.position_title?.[0];

        const selectedUnits = Object.keys(filter?.unit || {}) || [];
        const selectedPositions = Object.keys(filter?.position || {}) || [];

        return (
            (selectedUnits.length === 0 || selectedUnits.includes(unit.toString())) &&
            (selectedPositions.length === 0 || selectedPositions.includes(position.toString()))
        );
    });

    const body = activeExpert ? (
        <Expert expert={activeExpert} {...{ folder, website, block }} />
    ) : filteredExperts.length ? (
        <ul
            className={`relative z-0 divide-y divide-gray-200 border-b border-gray-200 overflow-y-auto flex-1`}
            style={{
                height: 'calc(100vh - 4rem - 61px)',
            }}
        >
            {filteredExperts.map((item, i) => {
                return (
                    <ExpertItem
                        key={i}
                        profile={item}
                        searchParams={searchParams}
                        website={website}
                    ></ExpertItem>
                );
            })}
        </ul>
    ) : null;

    return (
        <>
            <div
                className={`px-4 py-4 border-b border-t border-gray-200 lg:px-8 xl:border-t-0 flex items-center h-[60px]`}
            >
                <div className={`flex items-center w-full`}>
                    <Breadcrumb {...{ folder, website, activeId, queryText }}></Breadcrumb>
                    {activeExpert ? (
                        <Navigation
                            {...{
                                searchParams,
                                website,
                                activeExpert,
                                experts: filteredExperts,
                            }}
                        ></Navigation>
                    ) : (
                        <Filter {...{ website, experts, filter, setFilter }}></Filter>
                    )}
                </div>
            </div>
            {body}
        </>
    );
}
