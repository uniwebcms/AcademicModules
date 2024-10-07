import React from 'react';
import { SafeHtml, twMerge, Link, twJoin, Media, getPageProfile } from '@uniwebcms/module-sdk';
import Container from '../_utils/Container';

export default function HeroMedia({ block, website }) {
    const { themeName, main } = block;

    const {
        min_height = '100vh',
        show_gradient = false,
        gradient_from_pos = 'bottom',
        ...properties
    } = block.getBlockProperties();

    const { title = '', pretitle = '', subtitle = '' } = main.header || {};

    const banner = main?.banner;
    const paragraphs = main?.body?.paragraphs?.filter(Boolean);
    const links = main?.body?.links;
    const image = main?.body?.imgs[0];
    const video = main?.body?.videos[0];

    let gradient_to =
        themeName === 'context__dark'
            ? 'after:to-black'
            : themeName === 'context__light'
            ? 'after:to-white'
            : 'after:to-bg-color';

    const gradient = `after:absolute after:inset-0 after:from-transparent after:z-0 ${gradient_to} ${
        gradient_from_pos === 'top' ? 'after:bg-gradient-to-t after:from-50%' : 'after:bg-gradient-to-b'
    }`;

    return (
        <Container className={twJoin('!py-0', show_gradient ? gradient : '')} style={{ minHeight: min_height }}>
            <Background banner={banner} image={image} video={video} properties={properties} website={website} />
            <Content
                title={title}
                pretitle={pretitle}
                subtitle={subtitle}
                paragraphs={paragraphs}
                links={links}
                image={image}
                video={video}
                properties={properties}
            />
        </Container>
    );
}

const ContentWrapper = ({ children, hasTextContent, hasMediaContent, alignmentH }) => {
    if (hasTextContent && hasMediaContent) {
        return (
            <div
                className={twMerge(
                    'z-10 flex flex-grow flex-col lg:flex-row items-center justify-between lg:gap-x-6 gap-x-0 lg:gap-y-0 gap-y-6',
                    alignmentH === 'left' ? '' : '',
                    alignmentH === 'right' ? 'lg:flex-row-reverse' : ''
                )}>
                {children}
            </div>
        );
    } else {
        return <React.Fragment>{children}</React.Fragment>;
    }
};

const Content = ({ title, pretitle, subtitle, paragraphs, links, image, video, properties }) => {
    const {
        horizontal_alignment: alignmentH = 'center',
        vertical_alignment: alignmentV = 'center',
        show_back_drop = false,
        media_as_bg = false
    } = properties;

    if (media_as_bg) {
        video = undefined;
        image = undefined;
    }

    const hasTextContent = title || pretitle || subtitle || paragraphs?.length || links?.length;
    const hasMediaContent = image || video;

    return (
        <div
            className={twMerge(
                'flex h-full min-h-[inherit] max-w-7xl 2xl:max-w-8xl mx-auto px-6 md:px-8 py-12 md:py-16',
                alignmentH === 'center' ? 'justify-center' : '',
                alignmentH === 'left' ? 'justify-start' : '',
                alignmentH === 'right' ? 'justify-end' : '',
                alignmentV === 'center' ? 'items-center' : '',
                alignmentV === 'top' ? 'items-start' : '',
                alignmentV === 'bottom' ? 'items-end' : ''
            )}>
            <ContentWrapper hasTextContent={hasTextContent} hasMediaContent={hasMediaContent} alignmentH={alignmentH}>
                {/* Text Content */}
                <div
                    className={twJoin(
                        'relative rounded-2xl z-10 w-full max-w-2xl lg:max-w-xl xl:max-w-2xl',
                        !hasTextContent && 'hidden',
                        show_back_drop ? 'py-4 lg:py-6 xl:py-12 px-6 lg:px-10 xl:px-16' : ''
                    )}>
                    <div
                        className={twJoin(
                            'relative w-full',
                            alignmentV === 'center' && !hasMediaContent ? 'text-center' : '',
                            alignmentV === 'center' && hasMediaContent ? 'text-center lg:text-left' : ''
                        )}>
                        {pretitle ? <SafeHtml value={pretitle} as='h2' className='mb-3 text-lg lg:text-lg' /> : null}
                        <SafeHtml
                            as='h1'
                            className='text-2xl font-bold tracking-tight lg:text-3xl xl:text-4xl 2xl:text-5xl'
                            value={title}
                        />
                        {subtitle ? (
                            <SafeHtml
                                value={subtitle}
                                as='h3'
                                className='mt-4 text-lg leading-8 lg:text-xl xl:text-2xl'
                            />
                        ) : null}
                        {paragraphs?.length && paragraphs.filter(Boolean).length ? (
                            <SafeHtml value={paragraphs} className='mb-2 mt-4 lg:mt-6 xl:mt-8 text-base lg:text-lg' />
                        ) : null}
                        {links?.length ? (
                            <div
                                className={twJoin(
                                    'mt-10 flex items-center md:space-x-6 space-x-4',
                                    alignmentV === 'center' && !hasMediaContent ? 'justify-center' : '',
                                    alignmentV === 'center' && hasMediaContent ? 'justify-center lg:justify-start' : ''
                                )}>
                                {links.map((link, index) => {
                                    if (index === 0) {
                                        return (
                                            <Link
                                                key={index}
                                                to={link.href}
                                                className='rounded-md bg-primary-200 px-4 py-2.5 text-sm sm:text-base lg:text-lg !text-primary-800 font-semibold shadow-sm hover:bg-primary-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'>
                                                {link.label}
                                            </Link>
                                        );
                                    } else
                                        return (
                                            <Link
                                                key={index}
                                                to={link.href}
                                                className='text-sm sm:text-base lg:text-lg font-semibold leading-6 !text-primary-700 hover:underline hover:!text-primary-800'>
                                                {link.label} <span className='!text-primary-700'>→</span>
                                            </Link>
                                        );
                                })}
                            </div>
                        ) : null}
                    </div>
                    {show_back_drop ? (
                        <div
                            className='absolute w-full h-full top-0 left-0 bg-text-color-20 opacity-80 rounded-2xl'
                            style={{ zIndex: -1 }}></div>
                    ) : null}
                </div>
                {/* Media Content */}
                <div
                    className={twMerge(
                        'w-full mx-auto lg:mx-[inherit] max-w-2xl mt-12 lg:mt-0 lg:max-w-md xl:max-w-lg 2xl:max-w-xl z-10 flex-grow',
                        hasTextContent && hasMediaContent && alignmentH === 'left' ? 'lg:ml-8' : '',
                        hasTextContent && hasMediaContent && alignmentH === 'right' ? 'lg:mr-8' : '',
                        !hasMediaContent && 'hidden'
                    )}>
                    <Media
                        profile={getPageProfile()}
                        media={image && video ? video : video || image}
                        thumbnail={image && video ? image : undefined}
                        className={'rounded-2xl overflow-hidden'}
                    />
                </div>
            </ContentWrapper>
        </div>
    );
};

const Background = ({ banner, image, video, properties }) => {
    const { media_as_bg = false } = properties;

    let source;

    if (media_as_bg && (image || video)) {
        if (video) source = video;
        else if (image) source = image;
    } else {
        if (banner) source = banner;
    }

    if (!source) return null;

    return (
        <div className='absolute inset-0 z-0 w-full'>
            <Media profile={getPageProfile()} media={source} asBg={true} />
        </div>
    );
};
