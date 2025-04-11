import React from 'react';
import {
    Image,
    Icon,
    SafeHtml,
    Link,
    stripTags,
    getPageProfile,
    Media,
} from '@uniwebcms/module-sdk';
import Container from '../_utils/Container';

export default function Spotlight({ block, website }) {
    const items = block.getBlockItems();

    const { main } = block;
    const { title = '' } = main.header || {};

    const { vertical_padding = 'lg' } = block.getBlockProperties();

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

                const hasMedia = image || video;

                const media = (
                    <>
                        <Media
                            profile={getPageProfile()}
                            media={video || image}
                            className={'rounded-lg'}
                        />
                        {image && image.caption ? (
                            <figcaption>
                                <div
                                    className={`text-center mt-0.5 tracking-normal text-sm outline-none text-text-color/70`}
                                >
                                    {image.caption}
                                </div>
                            </figcaption>
                        ) : null}
                    </>
                );

                return (
                    <div key={index} className={`py-16 overflow-hidden`}>
                        <div className="px-6 mx-auto max-w-7xl lg:px-8">
                            <div className="grid max-w-2xl grid-cols-1 mx-auto gap-y-16 gap-x-8 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-x-16">
                                {index % 2 === 0 && hasMedia && (
                                    <div className="h-full">{media}</div>
                                )}
                                <div
                                    className={`${
                                        index % 2 === 0 && image ? 'lg:pt-4 lg:pr-4' : ''
                                    } ${index % 2 === 1 && image ? 'lg:pt-4 lg:pl-4' : ''}`}
                                >
                                    <div className="lg:max-w-lg">
                                        {icon && (
                                            <Icon
                                                icon={icon}
                                                className="w-12 h-12 p-1 rounded-md bg-primary-200 fill-primary-800"
                                            />
                                        )}
                                        <h3 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl md:text-3xl">
                                            {stripTags(title)}
                                        </h3>
                                        {subtitle && (
                                            <p className="mt-1 text-lg font-medium sm:text-xl text-text-color-80">
                                                {stripTags(subtitle)}
                                            </p>
                                        )}
                                        <SafeHtml
                                            value={paragraphs}
                                            className="mt-4 prose prose-base lg:prose-lg"
                                        />
                                        <div className="mt-6">
                                            {link && (
                                                <Link
                                                    to={website.makeHref(link.href)}
                                                    className="inline-flex rounded-md bg-primary-200 px-3.5 py-1.5 text-base font-medium group leading-7 text-primary-800 shadow-sm hover:bg-primary-800 hover:text-primary-100 hover:underline border border-primary-100 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-100"
                                                >
                                                    {stripTags(link.label)}
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {index % 2 === 1 && hasMedia && (
                                    <div className="h-full">{media}</div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </Container>
    );
}
