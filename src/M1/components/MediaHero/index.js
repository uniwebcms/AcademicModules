import React from 'react';
import Container from '../_utils/Container';
import { getPageProfile, twJoin } from '@uniwebcms/module-sdk';
import { Image, Media, SafeHtml, Link } from '@uniwebcms/core-components';
import { LuChevronRight } from 'react-icons/lu';

const parseButtonContent = (content) => {
    if (!content) return null;

    const container = document.createElement('div');
    container.innerHTML = content.trim();

    const link = container.firstElementChild;

    // is a link
    if (link && link.tagName.toLowerCase() === 'a') {
        return {
            target: link.getAttribute('target') || null,
            href: link.getAttribute('href') || null,
            label: link.textContent || '',
        };
    }

    return content;
};

export default function MediaHero(props) {
    const { block } = props;

    const { banner, title, subtitle, paragraphs, videos, images, links, buttons } =
        block.getBlockContent();

    const { layout = 'center' } = block.getBlockProperties();

    let video, image, videoThumbnail;

    if (videos[0] && images[0]) {
        video = videos[0];

        let coverImg = video?.coverImg;

        videoThumbnail = coverImg ? { url: coverImg } : images[0];
    } else if (videos[0]) {
        video = videos[0];

        let coverImg = video?.coverImg;
        videoThumbnail = coverImg ? { url: coverImg } : null;
    } else if (images[0]) {
        image = images[0];
    }

    const button = buttons[0];
    const buttonLink = button ? parseButtonContent(button.content) : null;

    return (
        <Container className={twJoin('min-h-96 w-full max-w-screen')} py="lg" px="none">
            {banner && (
                <div className="absolute inset-0">
                    <Image
                        profile={getPageProfile()}
                        {...banner}
                        className="object-cover w-full h-full"
                    />
                </div>
            )}
            <div
                className={twJoin(
                    'flex mx-auto px-6 md:px-8 lg:px-16 xl:px-24',
                    layout === 'center' ? 'flex-col' : 'flex-col lg:flex-row items-center max-w-8xl'
                )}
            >
                <div
                    className={twJoin(
                        'relative flex flex-col z-10',
                        layout === 'center'
                            ? 'mx-auto max-w-4xl text-center'
                            : 'w-full lg:w-1/2 text-center lg:text-left'
                    )}
                >
                    {title && (
                        <h1
                            className="text-3xl font-semibold md:text-4xl lg:text-5xl tracking-wide text-pretty"
                            style={{
                                lineHeight: '1.1',
                            }}
                        >
                            {title}
                        </h1>
                    )}
                    {subtitle && (
                        <h2
                            className={twJoin(
                                'mt-4 lg:mt-6 px-0 text-lg md:text-xl lg:text-2xl font-light tracking-wide text-pretty',
                                layout === 'center' ? 'lg:px-8' : ''
                            )}
                        >
                            {subtitle}
                        </h2>
                    )}
                    {paragraphs.filter(Boolean).length ? (
                        <SafeHtml
                            value={paragraphs}
                            className={twJoin(
                                'mt-4 lg:mt-6 text-lg lg:text-xl tracking-wide text-pretty',
                                layout === 'center' ? 'lg:px-8' : ''
                            )}
                        >
                            {subtitle}
                        </SafeHtml>
                    ) : null}
                    {links.length ? (
                        <div
                            className={twJoin(
                                'flex flex-wrap gap-6 mt-6',
                                layout === 'center'
                                    ? 'justify-center'
                                    : 'justify-center lg:justify-start'
                            )}
                        >
                            {links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.href}
                                    className={twJoin(
                                        'pl-5 pr-3 py-2 text-sm lg:text-base font-semibold rounded-lg flex items-center gap-2 transition-all',
                                        index === 0 &&
                                            'bg-text-color/80 text-bg-color hover:bg-text-color',
                                        index === 1 &&
                                            'border-2 border-text-color/80 bg-bg-color text-text-color/80 hover:bg-text-color/10 hover:text-text-color'
                                    )}
                                >
                                    {link.label}
                                    <LuChevronRight className="w-4 h-4 text-inherit" />
                                </Link>
                            ))}
                        </div>
                    ) : null}
                    {/* Gradient border styled button */}
                    {buttonLink ? (
                        <div className="mt-6 relative inline-flex rounded-3xl overflow-hidden hover:scale-105 transition-transform duration-500 ease-in-out">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary-500" />
                            <Link
                                href={buttonLink.href}
                                className="relative py-2 px-8 lg:px-12 bg-bg-color m-0.5 rounded-3xl"
                            >
                                <span className="font-bold">{buttonLink.label}</span>
                            </Link>
                        </div>
                    ) : null}
                </div>
                {video || image ? (
                    <div
                        className={twJoin(
                            'mx-auto',
                            video ? 'max-w-[44rem]' : 'max-w-2xl',
                            layout === 'center'
                                ? 'mt-10 w-full'
                                : 'w-full lg:w-1/2 mt-8 lg:mt-0 lg:pl-12'
                        )}
                    >
                        <Media
                            block={block}
                            profile={getPageProfile()}
                            media={video || image}
                            thumbnail={videoThumbnail}
                            className={twJoin('shadow-xl', video ? 'rounded-3xl' : '')}
                        />
                    </div>
                ) : null}
            </div>
        </Container>
    );
}
