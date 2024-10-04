import React from 'react';
import Container from '../_utils/Container';
import { Image, Link, twJoin, stripTags } from '@uniwebcms/module-sdk';

export default function (props) {
    const { block, website, input } = props;

    const { title = '' } = block.main?.header || {};
    const link = block.main?.body?.links?.[0];

    const profiles = input.profiles;

    const { layout = 'list' } = block.getBlockProperties();
    const items = block.getBlockItems();

    const wrapperClassName =
        layout === 'list'
            ? 'space-y-12'
            : layout === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8 xl:gap-12'
            : layout === 'snapping'
            ? 'snap-mandatory snap-x grid gap-5 overflow-auto gap-6 overscroll-contain'
            : '';

    const wrapperStyle =
        layout === 'snapping' ? { gridTemplateColumns: `repeat(${profiles.length || items.length}, 320px)` } : {};

    if (!profiles.length && !items.length) return null;

    return (
        <Container>
            {title || link ? (
                <div className='px-6 mx-auto max-w-7xl lg:px-8 mb-8 md:mb-12 lg:mb-16 flex items-center justify-between'>
                    <h2 className='text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl'>{stripTags(title)}</h2>
                    {link ? (
                        <Link
                            to={website.makeHref(link.href)}
                            target='_self'
                            className='text-base md:text-lg lg:text-xl font-medium hover:underline'>
                            {link.label}
                        </Link>
                    ) : null}
                </div>
            ) : null}
            <div className='px-6 mx-auto max-w-7xl lg:px-8'>
                <div className={wrapperClassName} style={wrapperStyle}>
                    {profiles.length ? (
                        <Profiles profiles={profiles} website={website} input={input} layout={layout} />
                    ) : items.length ? (
                        <Items items={items} layout={layout} />
                    ) : null}
                </div>
            </div>
        </Container>
    );
}

const Profiles = ({ profiles, website, input, layout }) => {
    return profiles.map((profile, index) => {
        const { title, subtitle } = profile.getBasicInfo();

        if (layout === 'list') {
            return (
                <div key={index} className='w-full flex justify-between items-start space-x-12'>
                    <div className='w-64 h-44 flex-shrink-0'>
                        <Image profile={profile} type='banner' rounded='rounded-xl' />
                    </div>
                    <div className='flex-grow h-44 flex flex-col'>
                        <h3 className='text-lg font-medium md:text-xl lg:text-2xl mb-2'>{title}</h3>
                        <p className='text-head-color-80 text-base md:text-lg lg:text-xl mb-5'>{subtitle}</p>
                        <Link
                            to={input.makeHref(profile)}
                            target='_self'
                            className='inline-block w-fit rounded-md px-3 py-1.5 text-sm sm:text-base font-medium bg-link-color/20 text-link-color hover:bg-link-color/10 hover:underline'>
                            {website.localize({ en: 'Explore more', es: 'Explorar más' })} →
                        </Link>
                    </div>
                </div>
            );
        } else {
            return (
                <Link
                    key={index}
                    to={input.makeHref(profile)}
                    target='_self'
                    className={twJoin(
                        'w-full h-52 border border-text-color-30 rounded-lg shadow-md shadow-color-30 overflow-hidden group',
                        layout === 'snapping' && 'snap-center'
                    )}>
                    <div className='w-full h-32'>
                        <Image profile={profile} type='banner' />
                    </div>
                    <div className='w-full h-20 px-4 py-3 relative'>
                        <h3 className='text-base sm:text-lg font-medium mb-1 truncate leading-6 group-hover:text-link-color'>
                            {title}
                        </h3>
                        <p className='text-text-color-80 text-sm truncate'>{subtitle}</p>
                    </div>
                </Link>
            );
        }
    });
};

const Items = ({ items, layout }) => {
    return items.map((item, index) => {
        const { banner, title, subtitle } = item;

        if (layout === 'list') {
            return (
                <div key={index} className='w-full flex justify-between items-start space-x-12'>
                    {banner?.url ? (
                        <div className='w-64 h-44 flex-shrink-0'>
                            <Image url={banner.url} rounded='rounded-xl' />
                        </div>
                    ) : null}
                    <div className='flex-grow h-44 flex flex-col'>
                        <h3 className='text-lg font-medium  md:text-xl lg:text-2xl mb-2'>{title}</h3>
                        <p className='text-head-color-80 text-base md:text-lg lg:text-xl mb-5'>{subtitle}</p>
                    </div>
                </div>
            );
        } else {
            return (
                <div
                    key={index}
                    className={twJoin(
                        'w-full h-52 border border-text-color-30 rounded-md shadow-color-30 overflow-hidden group',
                        layout === 'snapping' && 'snap-center'
                    )}>
                    {banner?.url ? (
                        <div className='w-full h-32'>
                            <Image url={banner.url} />
                        </div>
                    ) : null}
                    <div className='w-full h-20 px-3 py-2 relative group'>
                        <h3 className='text-base sm:text-lg font-medium mb-1 truncate leading-6  bg-heading-color-10 group-hover:bg-heading-color-0'>
                            {title}
                        </h3>
                        <p className='text-text-color-80 text-sm truncate'>{subtitle}</p>
                    </div>
                </div>
            );
        }
    });
};
