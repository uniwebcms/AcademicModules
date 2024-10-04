import React from 'react';
import Container from '../_utils/Container';
import { Image, Link, stripTags, getPageProfile, SafeHtml } from '@uniwebcms/module-sdk';

export default function Cards({ website, block }) {
    const { main } = block;

    const { header } = main;

    const { title = '', subtitle = '' } = header || {};

    const items = block.getBlockItems();

    return (
        <Container>
            <div className={'relative max-w-8xl mx-auto px-6 lg:px-8'}>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-center">
                    {stripTags(title)}
                </h2>
                {subtitle ? (
                    <h3 className="mt-2 text-lg leading-8 sm:text-xl text-text-color-80 text-center">
                        {stripTags(subtitle)}
                    </h3>
                ) : null}
                <div className="mt-12 flex flex-wrap gap-6">
                    {items.map((item, index) => {
                        const { banner, title, subtitle, paragraphs, links } = item;

                        return (
                            <div key={index} className="w-64 border border-text-color-20 rounded">
                                <div className="h-40 w-full">
                                    {banner ? (
                                        <Image
                                            profile={getPageProfile()}
                                            value={banner.value}
                                            url={banner.url}
                                            alt={banner.alt}
                                        ></Image>
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
                                                <Link
                                                    key={index}
                                                    to={website.makeHref(href)}
                                                    target="_blank"
                                                >
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
