import React from 'react';
import { SafeHtml, Icon, Link, stripTags, Image, getPageProfile, twJoin } from '@uniwebcms/module-sdk';
import Container from '../_utils/Container';

export default function Features({ block, website }) {
    const { main } = block;

    const items = block.getBlockItems();

    const { title = '', subtitle = '', pretitle = '' } = main.header || {};
    const link = main.body?.links?.[0];

    const { alignment = 'left' } = block.getBlockProperties();

    const banner = main.banner;
    if (alignment == 'center') return centerAlign(pretitle, title, subtitle, link, banner, items, website);

    return (
        <Container>
            {banner ? (
                <div className='absolute inset-0'>
                    <Image profile={getPageProfile()} value={banner.value} url={banner.url} alt={banner.alt} />
                    <div className='absolute inset-0' aria-hidden='true' />
                </div>
            ) : null}
            <div className='px-6 mx-auto max-w-7xl lg:px-8'>
                <div
                    className={twJoin(
                        'flex flex-col lg:grid grid-cols-3 gap-x-8 gap-y-12',
                        alignment === 'left' && 'flex-col-reverse'
                    )}>
                    {alignment == 'right' && (
                        <div className='flex flex-col'>
                            {pretitle && (
                                <h3 className='mb-2 lg:mb-3 font-light  text-lg sm:text-xl lg:text-2xl'>
                                    {stripTags(pretitle)}
                                </h3>
                            )}
                            <h2 className='text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl'>
                                {stripTags(title)}
                            </h2>
                            {subtitle && (
                                <p className='mt-3 lg:mt-4 font-medium text-text-color-80 text-base sm:text-lg lg:text-xl'>
                                    {stripTags(subtitle)}
                                </p>
                            )}
                            {link ? (
                                <Link
                                    to={website.makeHref(link.href)}
                                    className='inline-block w-fit mt-5 rounded-md px-3 py-1.5 text-sm sm:text-base font-medium'>
                                    {link.label}
                                </Link>
                            ) : null}
                        </div>
                    )}
                    <dl className='grid grid-cols-1 col-span-2 gap-x-8 gap-y-16 sm:grid-cols-2'>
                        {items.map((item, index) => {
                            const { title, subtitle, paragraphs, icons, links } = item;

                            const icon = icons[0];
                            const link = links[0];

                            return (
                                <div key={index}>
                                    <dt className='text-base font-semibold leading-7'>
                                        {icon ? (
                                            <div className='flex items-center justify-center w-12 h-12 mb-4 rounded-lg'>
                                                <Icon icon={icon} className='w-full h-full' />
                                            </div>
                                        ) : null}
                                        <h3 className='text-lg font-semibold lg:text-xl'>{stripTags(title)}</h3>
                                        {subtitle ? (
                                            <p className='mt-1 text-base font-medium lg:text-lg text-text-color-80'>
                                                {stripTags(subtitle)}
                                            </p>
                                        ) : null}
                                    </dt>
                                    <SafeHtml
                                        value={paragraphs}
                                        className='mt-3 text-base leading-7 line-clamp-4 lg:text-lg text-text-color-90'
                                    />
                                    {link ? (
                                        <Link
                                            to={link.href}
                                            className='inline-block mt-1.5 text-base leading-7 hover:underline'>
                                            {link.label} <span>→</span>
                                        </Link>
                                    ) : null}
                                </div>
                            );
                        })}
                    </dl>
                    {alignment == 'left' && (
                        <div className='flex flex-col'>
                            {pretitle && (
                                <h3 className='mb-2 lg:mb-3 font-light  text-lg sm:text-xl lg:text-2xl'>
                                    {stripTags(pretitle)}
                                </h3>
                            )}
                            <h2 className='text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl'>
                                {stripTags(title)}
                            </h2>
                            {subtitle && (
                                <p className='mt-3 lg:mt-4 font-medium text-text-color-80 text-base sm:text-lg lg:text-xl'>
                                    {stripTags(subtitle)}
                                </p>
                            )}
                            {link ? (
                                <Link
                                    to={website.makeHref(link.href)}
                                    className='inline-block w-fit mt-5 rounded-md px-3 py-1.5 text-sm sm:text-base lg:text-lg font-medium'>
                                    {link.label}
                                </Link>
                            ) : null}
                        </div>
                    )}
                </div>
            </div>
        </Container>
    );
}

const centerAlign = (pretitle, title, subtitle, link, banner, items, website) => {
    return (
        <Container>
            {banner ? (
                <div className='absolute inset-0'>
                    <Image profile={getPageProfile()} value={banner.value} url={banner.url} alt={banner.alt} />
                    <div className='absolute inset-0' aria-hidden='true' />
                </div>
            ) : null}
            <div className='px-6 mx-auto max-w-7xl lg:px-8'>
                <div className='max-w-4xl mx-auto lg:text-center'>
                    {pretitle && (
                        <h3 className='mb-2 lg:mb-3 font-light  text-lg sm:text-xl lg:text-2xl'>
                            {stripTags(pretitle)}
                        </h3>
                    )}
                    <h2 className='text-2xl font-bold tracking-tight  sm:text-3xl lg:text-4xl'>{stripTags(title)}</h2>
                    {subtitle && (
                        <p className='mt-3 lg:mt-4 font-medium text-neutral-700 text-base sm:text-lg lg:text-xl'>
                            {stripTags(subtitle)}
                        </p>
                    )}
                    {link ? (
                        <Link
                            to={website.makeHref(link.href)}
                            className='block mt-5 text-sm sm:text-base lg:text-lg font-medium text-primary-300 hover:text-primary-400'>
                            {link.label}
                        </Link>
                    ) : null}
                </div>
                <div className='max-w-5xl mx-auto mt-12 sm:mt-16 lg:mt-20'>
                    <dl className='grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16'>
                        {items.map((item, index) => {
                            const { title, subtitle, paragraphs, icons, links } = item;

                            const icon = icons[0];
                            const link = links[0];

                            return (
                                <div key={index} className='relative px-8'>
                                    <dt className='text-base font-semibold leading-7 text-gray-900'>
                                        <div className='absolute top-0 left-0 flex items-center justify-center w-12 h-12 rounded-lg'>
                                            <Icon icon={icon} className='w-full h-full' />
                                        </div>
                                        <h3 className={`text-lg lg:text-xl font-semibold  ${icon ? 'pl-10' : ''}`}>
                                            {stripTags(title)}
                                        </h3>
                                        {subtitle ? (
                                            <p className='mt-1 text-base font-medium lg:text-lg'>
                                                {stripTags(subtitle)}
                                            </p>
                                        ) : null}
                                    </dt>
                                    <SafeHtml
                                        value={paragraphs}
                                        className={`mt-2 text-base leading-7 lg:text-lg line-clamp-4 ${
                                            icon ? 'pl-10' : ''
                                        }`}
                                    />
                                    {link && (
                                        <Link
                                            to={link.href}
                                            className={`inline-block mt-2 text-base leading-7 hover:underline ${
                                                icon ? 'pl-10' : ''
                                            }`}>
                                            {link.label} <span>→</span>
                                        </Link>
                                    )}
                                </div>
                            );
                        })}
                    </dl>
                </div>
            </div>
        </Container>
    );
};
