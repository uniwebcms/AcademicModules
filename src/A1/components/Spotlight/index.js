import React from 'react';
import {
    Icon,
    SafeHtml,
    Link,
    stripTags,
    getPageProfile,
    Media,
    twJoin,
} from '@uniwebcms/module-sdk';
import Container from '../_utils/Container';

export default function Spotlight({ block, website }) {
    const items = block.getBlockItems();

    const { main } = block;
    const { title = '' } = main.header || {};

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
                                        {link && (
                                            <div className="mt-6">
                                                <Link
                                                    to={website.makeHref(link.href)}
                                                    className="inline-flex rounded-md bg-primary-200 px-3.5 py-1.5 text-base font-medium group leading-7 text-primary-800 shadow-sm hover:bg-primary-800 hover:text-primary-100 hover:underline border border-primary-100 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-100"
                                                >
                                                    {stripTags(link.label)}
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="w-full aspect-[16/9] md:aspect-[4/3]">
                                    <Media
                                        profile={getPageProfile()}
                                        media={video || image}
                                        className={'rounded-lg'}
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
