import React from 'react';
import { SafeHtml, Image, Link, stripTags, getPageProfile } from '@uniwebcms/module-sdk';
import Container from '../_utils/Container';

export default function List({ block, website }) {
    const { main } = block;
    const { title = '', subtitle = '' } = main.header || {};

    const items = block.getBlockItems();

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
            <div className="px-6 mx-auto max-w-7xl lg:px-8">
                <div className="max-w-2xl mx-auto lg:max-w-4xl">
                    {!!title && (
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                            {stripTags(title)}
                        </h2>
                    )}
                    {subtitle ? (
                        <h3 className="mt-3 leading-8 text-lg md:text-xl lg:text-2xl text-text-color-90">
                            {stripTags(subtitle)}
                        </h3>
                    ) : null}
                    <div
                        className={`${
                            title || subtitle ? 'mt-12' : ''
                        } space-y-20 lg:mt-16 lg:space-y-20`}
                    >
                        {items.map((item, index) => {
                            const { banner, title, subtitle, links, paragraphs } = item;
                            const link = links[0];

                            return (
                                <div
                                    key={index}
                                    className="relative flex flex-col gap-8 isolate lg:flex-row"
                                >
                                    <div className="relative aspect-[16/9] sm:aspect-[2/1] lg:aspect-square lg:w-64 lg:shrink-0">
                                        {banner && (
                                            <Image
                                                profile={getPageProfile()}
                                                value={banner.value}
                                                alt={banner.alt}
                                                url={banner.url}
                                                className="absolute inset-0 object-cover w-full h-full rounded-2xl bg-text-color-10"
                                            />
                                        )}
                                        <div className="absolute inset-0 rounded-2xl" />
                                    </div>
                                    <div>
                                        <div className="relative max-w-xl group">
                                            <div className="mt-2">
                                                <h3 className="text-xl lg:text-2xl font-semibold leading-8">
                                                    {stripTags(title)}
                                                </h3>
                                                {subtitle ? (
                                                    <p className="mt-1 text-lg lg:text-xl leading-6 text-text-color-80">
                                                        {stripTags(subtitle)}
                                                    </p>
                                                ) : null}
                                            </div>
                                            {paragraphs ? (
                                                <SafeHtml
                                                    value={paragraphs}
                                                    className="mt-5 text-base lg:text-lg leading-6 text-text-color-90"
                                                />
                                            ) : null}
                                            {link ? (
                                                <Link
                                                    to={website.makeHref(link.href)}
                                                    className="inline-block mt-5 hover:underline"
                                                >
                                                    {stripTags(link.label)} <span>→</span>
                                                </Link>
                                            ) : null}
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
