import React from 'react';
import { Image, SafeHtml, Link, stripTags, getPageProfile } from '@uniwebcms/module-sdk';
import Container from '../_utils/Container';

export default function FeatureList({ block, website }) {
    const { main } = block;

    const items = block.getBlockItems();

    const banner = main.banner;
    const { title = '', subtitle = '' } = main.header || {};

    return (
        <Container>
            {banner ? (
                <div className="absolute inset-0">
                    <Image
                        profile={getPageProfile()}
                        value={banner.value}
                        url={banner.url}
                        alt={banner.alt}
                    />
                    <div className="absolute inset-0" aria-hidden="true" />
                </div>
            ) : null}
            <div className="mx-auto max-w-7xl px-6 md:px-8">
                <div className="relative flex flex-col">
                    <h2 className="text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl">
                        {stripTags(title)}
                    </h2>
                    {subtitle ? (
                        <p className="mt-4 text-xl !text-neutral-800 md:text-2xl">
                            {stripTags(subtitle)}
                        </p>
                    ) : null}
                </div>
                <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-2 lg:gap-x-8 lg:gap-y-10">
                    {items.map((item, index) => {
                        const { banner, title, links, lists } = item;

                        const link = links[0];
                        const list = lists[0];

                        return (
                            <div
                                key={index}
                                className="z-10 flex flex-col shadow-xl bg-bg-color-60 rounded-2xl"
                            >
                                <div className="px-6 md:px-8 py-4 md:py-6 space-y-3">
                                    {banner ? (
                                        <div className="w-10 h-10">
                                            <Image
                                                profile={getPageProfile()}
                                                value={banner.value}
                                                alt={banner.alt}
                                                url={banner.url}
                                                className="w-full h-full rounded-lg"
                                            />
                                        </div>
                                    ) : null}
                                    <h4 className="text-xl font-medium text-text-color">{title}</h4>
                                    <div className="text-base">
                                        {list ? (
                                            <ul className="mt-2 ml-4 list-disc space-y-1.5">
                                                {list.map((listItem, itemIndex) => {
                                                    return (
                                                        <li key={itemIndex}>
                                                            <SafeHtml
                                                                value={listItem.paragraphs[0]}
                                                                className="text-text-color-80"
                                                            />
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        ) : null}
                                    </div>
                                </div>
                                {link ? (
                                    <div className="px-6 pt-3 pb-4 rounded-bl-2xl rounded-br-2xl md:px-8">
                                        <Link
                                            to={website.makeHref(link.href)}
                                            className="text-base font-medium"
                                        >
                                            <span className="text-link-color">
                                                {stripTags(link.label)}
                                            </span>
                                        </Link>
                                    </div>
                                ) : null}
                            </div>
                        );
                    })}
                </div>
            </div>
        </Container>
    );
}
