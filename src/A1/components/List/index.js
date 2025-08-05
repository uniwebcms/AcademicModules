import React from 'react';
import { stripTags, getPageProfile, twJoin } from '@uniwebcms/module-sdk';
import { SafeHtml, Image, Link } from '@uniwebcms/core-components';
import Container from '../_utils/Container';

export default function List({ block, website }) {
    const { main } = block;
    const { title = '', subtitle = '' } = main.header || {};

    const items = block.getBlockItems();

    const { vertical_padding = 'lg', image_fit = 'cover' } = block.getBlockProperties();

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

    let imageFit;

    if (image_fit === 'cover') {
        imageFit = 'object-cover';
    } else if (image_fit === 'contain') {
        imageFit = 'object-contain';
    } else if (image_fit === 'fill') {
        imageFit = 'object-fill';
    }

    return (
        <Container py={py}>
            <div className="px-6 mx-auto max-w-7xl lg:px-8">
                <div className="max-w-2xl mx-auto lg:max-w-4xl">
                    {title && (
                        <SafeHtml
                            as="h2"
                            value={title}
                            className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl rich-text"
                        />
                    )}
                    {subtitle ? (
                        <SafeHtml
                            as="p"
                            value={subtitle}
                            className="mt-3 leading-8 text-lg md:text-xl lg:text-2xl text-text-color-90 rich-text"
                        />
                    ) : null}
                    <div
                        className={`${
                            title || subtitle ? 'mt-12' : ''
                        } space-y-20 lg:mt-16 lg:space-y-20`}
                    >
                        {items.map((item, index) => {
                            const { banner, title, subtitle, links, paragraphs } = item;

                            return (
                                <div
                                    key={index}
                                    className="relative flex flex-col gap-8 isolate lg:flex-row"
                                >
                                    <div className="relative">
                                        <div className="relative aspect-[16/9] sm:aspect-[2/1] lg:aspect-square lg:w-64 lg:shrink-0">
                                            {banner && (
                                                <Image
                                                    profile={getPageProfile()}
                                                    {...banner}
                                                    className={twJoin(
                                                        'absolute inset-0 w-full h-full rounded-2xl bg-text-color-10',
                                                        imageFit
                                                    )}
                                                />
                                            )}
                                            <div className="absolute inset-0 rounded-2xl" />
                                        </div>
                                        {banner?.caption ? (
                                            <figcaption className="lg:w-64">
                                                <div
                                                    className={`text-center mt-0.5 tracking-normal text-sm outline-none text-text-color/70`}
                                                >
                                                    {banner.caption}
                                                </div>
                                            </figcaption>
                                        ) : null}
                                    </div>
                                    <div>
                                        <div className="relative max-w-xl group">
                                            <div className="mt-2">
                                                <SafeHtml
                                                    as="h3"
                                                    value={title}
                                                    className="text-xl lg:text-2xl font-semibold leading-8 rich-text"
                                                />
                                                {subtitle ? (
                                                    <SafeHtml
                                                        as="p"
                                                        value={subtitle}
                                                        className="mt-1 text-lg lg:text-xl leading-6 text-text-color-80 rich-text"
                                                    />
                                                ) : null}
                                            </div>
                                            {paragraphs ? (
                                                <SafeHtml
                                                    value={paragraphs}
                                                    className="mt-5 text-base lg:text-lg leading-6 text-text-color-90 rich-text"
                                                />
                                            ) : null}
                                            <div className="mt-5 flex flex-wrap gap-x-4 gap-y-3">
                                                {links.map((link, idx) => {
                                                    const singleLink = links.length === 1;

                                                    return (
                                                        <Link
                                                            key={idx}
                                                            to={link.href}
                                                            className={twJoin(
                                                                singleLink
                                                                    ? 'group inline-block hover:underline'
                                                                    : 'px-4 py-2 text-sm font-medium text-link-color bg-link-color/20 hover:bg-link-color/10 rounded-lg transition-colors'
                                                            )}
                                                        >
                                                            {link.label}
                                                            {singleLink ? <span> →</span> : null}
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </Container>
    );
}
