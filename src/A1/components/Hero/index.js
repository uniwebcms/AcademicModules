import React from 'react';
import { SafeHtml, twMerge, Image, Link, twJoin, getPageProfile } from '@uniwebcms/module-sdk';
import Container from '../_utils/Container';

export default function Hero(props) {
    const { block } = props;

    const { themeName, main } = block;

    const properties = block.getBlockProperties();
    const {
        min_height = '100vh',
        show_back_drop = false,
        show_gradient = false,
        gradient_from_pos = 'bottom',
        horizontal_alignment: alignmentH = 'center',
        vertical_alignment: alignmentV = 'center'
    } = properties;

    const { title = '', pretitle = '', subtitle = '' } = main.header || {};

    const paragraphs = main.body?.paragraphs.filter(Boolean);
    const links = main.body?.links;

    const banner = block.main?.banner;

    const hasContent = title || pretitle || subtitle || paragraphs?.length || links?.length;

    let gradient_to =
        themeName === 'context__dark'
            ? 'after:to-black'
            : themeName === 'context__light'
            ? 'after:to-white'
            : 'after:to-bg-color';

    const gradient = `after:absolute after:inset-0 after:from-transparent after:z-0 ${gradient_to}
        ${gradient_from_pos === 'top' ? 'after:bg-gradient-to-t after:from-50%' : 'after:bg-gradient-to-b'}
    `;

    return (
        <Container py='0' className={show_gradient ? gradient : ''} style={{ height: min_height }}>
            {banner && (
                <div className={twJoin('absolute inset-0', banner.direction !== 'background' && 'max-w-7xl mx-auto')}>
                    <Image
                        profile={getPageProfile()}
                        value={banner.value}
                        alt={banner.alt}
                        url={banner.url}
                        className='object-cover w-full h-full'
                    />
                </div>
            )}
            <div
                className={twMerge(
                    'flex h-full xl:px-12 2xl:px-32',
                    alignmentH === 'center' ? 'justify-center' : '',
                    alignmentH === 'left' ? 'justify-start' : '',
                    alignmentH === 'right' ? 'justify-end' : '',
                    alignmentV === 'center' ? 'items-center' : '',
                    alignmentV === 'top' ? 'items-start' : '',
                    alignmentV === 'bottom' ? 'items-end' : ''
                )}>
                <div
                    className={twMerge(
                        'z-10 max-w-7xl relative mx-6 md:mx-8 flex justify-center text-center  rounded-2xl',
                        !hasContent && 'hidden',
                        show_back_drop ? 'my-16 md:my-20 py-10 md:py-16 px-10 md:px-16' : 'my-8 md:my-10 py-8 md:py-12'
                    )}>
                    <div className='relative lg:w-full md:max-w-2xl lg:max-w-3xl xl:max-w-4xl 2xl:max-w-5xl'>
                        <div className='relative'>
                            <div>
                                {pretitle ? (
                                    <SafeHtml
                                        value={pretitle}
                                        as='h2'
                                        className='mb-4 text-xl sm:text-2xl lg:text-3xl text-heading-color/90'
                                    />
                                ) : null}
                                <SafeHtml
                                    as='h1'
                                    className='text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl xl:text-5xl'
                                    value={title}
                                />
                                {subtitle ? (
                                    <SafeHtml
                                        value={subtitle}
                                        as='h2'
                                        className='mt-6 text-lg leading-8 sm:text-2xl text-text-color-80'
                                    />
                                ) : null}
                                {paragraphs?.length && paragraphs.filter(Boolean).length ? (
                                    <SafeHtml value={paragraphs} className='mb-2 mt-10 text-text-color-90' />
                                ) : null}
                                {links?.length ? (
                                    <div className='flex mt-10 items-center justify-center md:space-x-6 space-x-4'>
                                        {links.map((link, index) => {
                                            if (index === 0) {
                                                return (
                                                    <Link
                                                        key={index}
                                                        to={link.href}
                                                        className='rounded-md text-primary-700 bg-primary-200 px-4 py-2.5 text-sm sm:text-base lg:text-lg font-semibold shadow-sm hover:bg-primary-300'>
                                                        {link.label}
                                                    </Link>
                                                );
                                            } else
                                                return (
                                                    <Link
                                                        key={index}
                                                        to={link.href}
                                                        className='text-sm sm:text-base lg:text-lg font-semibold leading-6 text-primary-200 hover:underline hover:text-primary-300'>
                                                        {link.label} <span className='text-primary-200'>→</span>
                                                    </Link>
                                                );
                                        })}
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>
                    {show_back_drop ? (
                        <div
                            className='absolute w-full h-full top-0 left-0 bg-text-color-10 opacity-80 rounded-2xl'
                            style={{ zIndex: -1 }}></div>
                    ) : null}
                </div>
            </div>
        </Container>
    );
}
