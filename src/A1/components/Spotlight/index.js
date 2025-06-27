import React from 'react';
import { stripTags, getPageProfile, twJoin } from '@uniwebcms/module-sdk';
import { Icon, SafeHtml, Link, Media } from '@uniwebcms/core-components';
import Container from '../_utils/Container';

export default function Spotlight({ block, website }) {
    const { title } = block.getBlockContent();
    const items = block.getBlockItems();

    const { vertical_padding = 'lg', vertical_alignment = 'top' } = block.getBlockProperties();

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

    return (
        <Container py={py}>
            {title ? (
                <h2 className="px-6 mx-auto max-w-7xl lg:px-8 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                    {stripTags(title)}
                </h2>
            ) : null}
            {items.map((item, index) => {
                const { title, subtitle, paragraphs, icons, images, links, videos } = item;

                const icon = icons[0];
                const image = images[0];
                const link = links[0];
                const video = videos[0];

                return (
                    <div key={index} className="py-8 lg:py-16 overflow-hidden">
                        <div className="px-6 mx-auto max-w-7xl lg:px-8">
                            <div
                                className={twJoin(
                                    'grid grid-cols-1 md:grid-cols-2 lg:gap-x-16 gap-x-8 gap-y-6',
                                    vertical_alignment === 'top' ? 'md:items-start' : '',
                                    vertical_alignment === 'center' ? 'md:items-center' : '',
                                    vertical_alignment === 'bottom' ? 'md:items-end' : ''
                                )}
                            >
                                <div
                                    className={twJoin(
                                        '-order-1',
                                        index % 2 === 0 ? 'md:pr-4' : '',
                                        index % 2 === 1 ? 'md:pl-4 md:order-2' : '',
                                        vertical_alignment === 'top' ? 'md:pt-4' : '',
                                        vertical_alignment === 'center' ? 'md:py-2' : '',
                                        vertical_alignment === 'bottom' ? 'md:pb-4' : ''
                                    )}
                                >
                                    <div>
                                        {icon && (
                                            <Icon
                                                icon={icon}
                                                className="w-12 h-12 p-1 rounded-md bg-primary-200 fill-primary-800"
                                            />
                                        )}
                                        <SafeHtml
                                            as="h3"
                                            value={title}
                                            className="mt-1 text-xl font-bold tracking-tight md:text-2xl lg:text-3xl rich-text"
                                        />
                                        {subtitle && (
                                            <SafeHtml
                                                as="p"
                                                value={subtitle}
                                                className="mt-1 font-medium lg:text-xl md:text-lg text-base text-text-color-80 rich-text"
                                            />
                                        )}
                                        <SafeHtml
                                            value={paragraphs}
                                            className="mt-4 prose prose-sm md:prose-base lg:prose-lg"
                                        />
                                        {links.length > 0 && (
                                            <div className="mt-6 flex flex-wrap gap-x-4 gap-y-3">
                                                {links.map((link, idx) => (
                                                    <Link
                                                        key={idx}
                                                        to={link.href}
                                                        className="inline-flex rounded-md px-4 py-2.5 text-sm font-semibold shadow-sm bg-link-color/20 hover:bg-link-color/10 transition-all"
                                                    >
                                                        {link.label}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="w-full aspect-[16/9] md:aspect-[4/3]">
                                    <Media
                                        profile={getPageProfile()}
                                        media={video || image}
                                        className={'rounded-lg'}
                                        block={block}
                                    />
                                    {image && image.caption ? (
                                        <figcaption>
                                            <div className="text-center mt-0.5 tracking-normal text-sm outline-none text-text-color/70">
                                                {image.caption}
                                            </div>
                                        </figcaption>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </Container>
    );
}
