import React from 'react';
import { Image, Link, twMerge, stripTags, twJoin } from '@uniwebcms/module-sdk';
import { MdPlayArrow } from 'react-icons/md';
import './style.css';

const VideoItem = ({ profile, input, layout, isPanel }) => {
    const { title, subtitle, lastLocalEditTime } = profile.getBasicInfo();

    if (layout === 'list') {
        if (isPanel) {
            return (
                <Link
                    to={input.makeHref(profile)}
                    className="w-full flex justify-between items-start space-x-4 group"
                >
                    <div className="w-36 h-24 flex-shrink-0 relative">
                        <Image profile={profile} type="banner" rounded="rounded-md" />
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full p-2 bg-primary-200 text-primary-800 invisible group-hover:visible">
                            <MdPlayArrow className="w-5 h-5 pl-px playIcon text-inherit"></MdPlayArrow>
                        </div>
                    </div>
                    <div className="flex-grow h-24 flex flex-col">
                        <h3 className="text-sm font-medium mb-1 line-clamp-2 group-hover:underline break-all">
                            {title}
                        </h3>
                        <p className="text-sm line-clamp-1 mb-0.5 break-all text-text-color-80">
                            {subtitle}
                        </p>
                        <p className="text-xs text-text-color-60">{lastLocalEditTime}</p>
                    </div>
                </Link>
            );
        }

        return (
            <Link
                to={input.makeHref(profile)}
                className="w-full flex justify-between items-start space-x-12 group"
            >
                <div className="w-64 h-40 flex-shrink-0 relative">
                    <Image profile={profile} type="banner" rounded="rounded-xl" />
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full p-2 bg-primary-200 group-hover:bg-primary-800 text-primary-800 group-hover:text-primary-200">
                        <MdPlayArrow className="w-6 h-6 pl-px playIcon text-inherit"></MdPlayArrow>
                    </div>
                </div>
                <div className="flex-grow h-40 flex flex-col">
                    <h3 className="text-lg font-medium md:text-xl mb-2 truncate group-hover:underline">
                        {title}
                    </h3>
                    <p className="md:text-lg mb-5 text-text-color-80">{subtitle}</p>
                </div>
            </Link>
        );
    }

    return (
        <Link
            className="w-full h-64 flex-shrink-0 overflow-hidden group"
            to={input.makeHref(profile)}
        >
            <div className="h-48 cursor-pointer relative rounded-lg overflow-hidden">
                <Image profile={profile} type="banner" />
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full p-2 bg-primary-200 group-hover:bg-primary-800 text-primary-800 group-hover:text-primary-200">
                    <MdPlayArrow className="w-6 h-6 pl-px playIcon text-inherit"></MdPlayArrow>
                </div>
            </div>
            <div className="h-16 bg-inherit pt-3">
                <h3 className="truncate font-medium text-lg group-hover:underline">{title}</h3>
                <p className="truncate text-base text-text-color-80">{subtitle}</p>
            </div>
        </Link>
    );
};

export default function (props) {
    const { block, input, website } = props;

    const { title } = block;

    const { layout = 'list', is_panel = false } = block.getBlockProperties();

    const wrapperClassName =
        layout === 'list'
            ? is_panel
                ? 'space-y-6'
                : 'space-y-12'
            : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 xl:gap-12';

    const profiles = input?.profiles || [];

    return (
        <div
            className={
                !is_panel
                    ? 'h-screen py-6 lg:py-8 xl:py-12 2xl:py-16 3xl:py-20 overflow-y-auto'
                    : ''
            }
        >
            {title ? (
                <div
                    className={twJoin(
                        'mx-auto',
                        is_panel
                            ? 'px-0 max-w-full mb-4'
                            : 'px-6 max-w-7xl lg:px-8 mb-8 md:mb-12 lg:mb-16'
                    )}
                >
                    <h2
                        className={twJoin(
                            'font-bold tracking-tight',
                            is_panel ? 'text-xl  md:text-2xl' : 'text-3xl  md:text-4xl lg:text-5xl'
                        )}
                    >
                        {stripTags(title)}
                    </h2>
                </div>
            ) : null}
            {profiles.length ? (
                <div
                    className={twJoin(
                        'mx-auto',
                        is_panel ? 'px-0 max-w-full' : 'px-6 max-w-7xl lg:px-8'
                    )}
                >
                    <div className={wrapperClassName}>
                        {profiles.map((item, i) => {
                            return (
                                <VideoItem
                                    key={i}
                                    profile={item}
                                    input={input}
                                    layout={layout}
                                    isPanel={is_panel}
                                ></VideoItem>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div className="text-text-color/60 italic font-xl text-center">
                    {website.localize({
                        en: 'No videos source found',
                        fr: 'Aucune source vidéo trouvée',
                    })}
                </div>
            )}
        </div>
    );
}
