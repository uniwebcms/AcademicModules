import React from 'react';
import { Profile } from '@uniwebcms/module-sdk';
import { Image } from '@uniwebcms/core-components';

const ResultItem = (props) => {
    const { website, title, description, href, route, banner, avatar, contentType, contentId } =
        props;

    const imgType = banner ? 'banner' : avatar ? 'avatar' : '';
    const version = banner || avatar || '';

    const { Link } = website.getRoutingComponents();

    const profile = Profile.newProfile(contentType || 'website', contentId || website.getSiteId(), {
        head: {
            [`_${imgType}`]: version,
        },
    });

    return (
        <Link
            to={route}
            className={`px-6 py-5 flex min-h-[80px] border-b border-neutral-300 group bg-neutral-100 hover:bg-neutral-50 transition-colors`}
        >
            <div className={`flex flex-col overflow-hidden`}>
                <span className={`text-lg truncate text-[#1a0dab] group-hover:underline`}>
                    {title}
                </span>
                <span className={`text-base leading-[1.2] truncate text-[#006621]`}>{href}</span>
                <span className={`text-sm mt-1.5 leading-[18px] line-clamp-3 text-[#444]`}>
                    {description}
                </span>
            </div>
            {imgType && version ? (
                <div className={`w-[110px] flex-shrink-0 ml-4`}>
                    <Image profile={profile} type={imgType}></Image>
                </div>
            ) : null}
        </Link>
    );
};

export default ResultItem;
