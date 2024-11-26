import React from 'react';
import { Link } from '@uniwebcms/module-sdk';
import { HiArrowNarrowLeft, HiArrowNarrowRight } from 'react-icons/hi';

const ProfileBtn = (props) => {
    const { profile, type, searchParams } = props;

    let params = { ...searchParams, expert: profile.options.fileId };

    let search = '';

    for (let i in params)
        search += search ? `&${i}=${params[i]}` : `?${i}=${params[i]}`;

    const name = profile.getBasicInfo().title;

    const inner =
        type === 'pre' ? (
            <div className={`flex items-center`}>
                <HiArrowNarrowLeft className={`w-5 h-5`}></HiArrowNarrowLeft>
                <span className={`ml-2`}>{name}</span>
            </div>
        ) : (
            <div className={`flex items-center`}>
                <span className={`mr-2`}>{name}</span>
                <HiArrowNarrowRight className={`w-5 h-5`}></HiArrowNarrowRight>
            </div>
        );

    return (
        <Link to={search}>
            <div
                className={`text-sm font-medium text-gray-500 hover:text-gray-700 cursor-pointer flex items-center`}
            >
                {inner}
            </div>
        </Link>
    );
};

export default function ExpertNavigation(props) {
    const { activeExpert, experts, searchParams } = props;

    let pre = null;
    let next = null;

    if (experts.length > 1) {
        const index = experts.findIndex(
            (item) => item.options?.fileId === activeExpert
        );

        if (index > 0) {
            pre = experts[index - 1];
        }

        if (index < experts.length - 1) {
            next = experts[index + 1];
        }
    }

    return (
        <div className={`flex items-center ml-auto`}>
            {pre ? (
                <ProfileBtn
                    key="pre"
                    type="pre"
                    profile={pre}
                    searchParams={searchParams}
                ></ProfileBtn>
            ) : null}
            {pre && next ? (
                <div className={`w-px self-stretch bg-gray-400 mx-4`}></div>
            ) : null}
            {next ? (
                <ProfileBtn
                    key="next"
                    type="next"
                    profile={next}
                    searchParams={searchParams}
                ></ProfileBtn>
            ) : null}
        </div>
    );
}
