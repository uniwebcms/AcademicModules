import React from 'react';
import Container from '../_utils/Container';
import { Image, Link, stripTags, getPageProfile, SafeHtml, twJoin } from '@uniwebcms/module-sdk';

export default function Cards({ website, block }) {
    const { main } = block;

    const { header } = main;

    const { title = '', subtitle = '' } = header || {};

    const items = block.getBlockItems();

    let cardWidth, cardLayout, imageAspectRatio;

    const {
        size = 'small',
        layout = 'start',
        vertical_padding = 'lg',
        image_aspect_ratio = 'landscape',
    } = block.getBlockProperties();

    if (size === 'small') {
        cardWidth = 'w-64';
    } else if (size === 'regular') {
        cardWidth = 'w-[18rem]';
    } else if (size === 'large') {
        cardWidth = 'w-[20rem]';
    } else if (size === 'xlarge') {
        cardWidth = 'w-[24rem]';
    }

    if (layout === 'start') {
        cardLayout = 'justify-start';
    } else if (layout === 'center') {
        cardLayout = 'justify-center';
    } else if (layout === 'end') {
        cardLayout = 'justify-end';
    } else if (layout === 'space-around') {
        cardLayout = 'justify-around';
    }

    let py = '';

    if (vertical_padding === 'none') {
        py = 'py-0 lg:py-0';
    } else if (vertical_padding === 'sm') {
        py = 'py-6 lg:py-12';
    } else if (vertical_padding === 'md') {
        py = 'py-8 lg:py-16';
    } else if (vertical_padding === 'lg') {
        py = 'py-12 lg:py-24';
    }

    if (image_aspect_ratio === 'landscape') {
        imageAspectRatio = 'aspect-video';
    }
    if (image_aspect_ratio === 'portrait') {
        imageAspectRatio = 'aspect-[2/3]';
    }
    if (image_aspect_ratio === 'square') {
        imageAspectRatio = 'aspect-square';
    }

    return (
        <Container py={py}>
            <div className={'relative max-w-7xl mx-auto px-6 lg:px-8'}>
                {!!title && (
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-center">
                        {stripTags(title)}
                    </h2>
                )}
                {subtitle ? (
                    <h3 className="mt-2 text-lg leading-8 sm:text-xl text-text-color-80 text-center">
                        {stripTags(subtitle)}
                    </h3>
                ) : null}
                <div
                    className={`${
                        title || subtitle ? 'mt-12' : ''
                    } flex flex-wrap gap-6 ${cardLayout}`}
                >
                    {items.map((item, index) => {
                        const { banner, title, subtitle, paragraphs, links } = item;

                        return (
                            <div
                                key={index}
                                className={`${cardWidth} border border-text-color-20 rounded`}
                            >
                                <div className={twJoin('w-full', imageAspectRatio)}>
                                    {banner ? (
                                        <div className="relative w-full h-full">
                                            <Image
                                                profile={getPageProfile()}
                                                value={banner.value}
                                                url={banner.url}
                                                alt={banner.alt}
                                            ></Image>
                                            {banner.caption ? (
                                                <figcaption className="absolute bottom-0 w-full">
                                                    <div
                                                        className={`text-center tracking-normal text-sm outline-none text-text-color-10 bg-text-color/70`}
                                                    >
                                                        {banner.caption}
                                                    </div>
                                                </figcaption>
                                            ) : null}
                                        </div>
                                    ) : null}
                                </div>
                                <div className="w-full px-4 py-4">
                                    <h4 className="text-lg font-semibold tracking-tight">
                                        {stripTags(title)}
                                    </h4>
                                    <h5 className="text-text-color-80">{stripTags(subtitle)}</h5>
                                    <SafeHtml value={paragraphs} className="mt-2 text-base" />
                                    <div className="mt-3 space-y-1">
                                        {links.map((link, index) => {
                                            const { href, label } = link;

                                            if (
                                                href.startsWith('tel:') ||
                                                href.startsWith('mailto:')
                                            ) {
                                                return (
                                                    <a key={index} href={href}>
                                                        {label}
                                                    </a>
                                                );
                                            }

                                            return (
                                                <Link key={index} to={website.makeHref(href)}>
                                                    {label}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </Container>
    );
}
