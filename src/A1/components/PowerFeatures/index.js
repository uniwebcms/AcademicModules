import React from 'react';
import { SafeHtml, Image, Link, stripTags, getPageProfile } from '@uniwebcms/module-sdk';
import Container from '../_utils/Container';

export default function PowerFeatures({ block }) {
    const { main } = block;

    const { title = '', subtitle = '' } = main.header || {};

    const items = block.getBlockItems();

    return (
        <Container py="0">
            <div
                className={`px-6 lg:px-8 max-w-5xl mx-auto pt-16 lg:pt-24 pb-4 text-center leading-[2.3rem]`}
            >
                <h2 className="text-3xl font-bold tracking-tight  sm:text-4xl lg:text-5xl">
                    {stripTags(title)}
                </h2>
                {subtitle ? (
                    <h3 className="mt-3 leading-8 text-lg md:text-xl lg:text-2xl text-text-color-80">
                        {stripTags(subtitle)}
                    </h3>
                ) : null}
            </div>
            <div className="grid grid-cols-1 px-6 mx-auto max-w-7xl sm:px-8 lg:px-0 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-6 pb-8 lg:pb-12">
                {items.map((power, index) => {
                    const { banner, title, paragraphs, links } = power;

                    const link = links[0];

                    return (
                        <div key={index} className="py-12 sm:py-16 sm:mx-8">
                            {banner ? (
                                <Image
                                    profile={getPageProfile()}
                                    value={banner.value}
                                    alt={banner.alt}
                                    url={banner.url}
                                    className="object-contain w-24 h-24 p-2 border-4 shadow-md border-primary-100 rounded-3xl bg-primary-200 text-primary-800"
                                />
                            ) : null}
                            <h3 className="my-4 text-2xl font-bold text-text-color">
                                {stripTags(title)}
                            </h3>
                            <SafeHtml value={paragraphs} className="py-2 text-text-color-90" />
                            {link ? (
                                <Link
                                    to={link.href}
                                    className="mt-4 text-sm font-medium hover:underline"
                                >
                                    {link.label}
                                </Link>
                            ) : null}
                        </div>
                    );
                })}
            </div>
        </Container>
    );
}
