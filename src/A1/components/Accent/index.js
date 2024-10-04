import React from 'react';
import Container from '../_utils/Container';
import { Image, twJoin, SafeHtml, Link, stripTags, getPageProfile } from '@uniwebcms/module-sdk';

export default function (props) {
    const { block, website } = props;
    const { main } = block;

    const { title = '', subtitle = '', pretitle = '' } = main.header || {};

    const { alignment = 'left', show_back_drop = false } = block.getBlockProperties();

    const { banner } = main;
    const paragraphs = main.body?.paragraphs;
    const links = main.body?.links;
    const link = links?.[0];

    return (
        <Container py="0">
            {banner ? (
                <div
                    className={twJoin(
                        'absolute inset-0',
                        banner.direction !== 'background' && 'max-w-7xl mx-auto'
                    )}
                >
                    <Image
                        profile={getPageProfile()}
                        value={banner.value}
                        alt={banner.alt}
                        url={banner.url}
                        className="object-cover w-full h-full"
                    />
                </div>
            ) : null}
            <div className="relative max-w-7xl mx-auto">
                <div
                    className={twJoin(
                        'relative z-10 flex w-full min-h-[560px]',
                        alignment === 'left' && 'justify-start text-left',
                        alignment === 'center' && 'justify-center text-center',
                        alignment === 'right' && 'justify-end text-right'
                    )}
                >
                    <div className="relative lg:max-w-3xl w-full flex flex-col px-6 md:px-8 py-12 md:py-16 lg:py-20">
                        {pretitle ? (
                            <h3 className="mb-2 font-medium text-xl md:text-2xl lg:text-3xl">
                                {stripTags(pretitle)}
                            </h3>
                        ) : null}
                        <h2 className="text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl">
                            {stripTags(title)}
                        </h2>
                        {subtitle ? (
                            <h3 className="mt-3 leading-8 text-lg md:text-xl lg:text-2xl text-text-color-80">
                                {stripTags(subtitle)}
                            </h3>
                        ) : null}
                        <SafeHtml
                            className="mt-6 lg:mt-8 text-base md:text-lg space-y-3 !leading-7 lg:!leading-8"
                            value={paragraphs}
                        />
                        {link ? (
                            <div className="mt-5 flex items-center justify-center">
                                <Link
                                    to={website.makeHref(link.href)}
                                    className="text-base font-semibold leading-6"
                                >
                                    {link.label} <span className="!text-[inherit]">→</span>
                                </Link>
                            </div>
                        ) : null}
                        {show_back_drop && (
                            <div
                                className="absolute inset-0 bg-bg-color opacity-75"
                                style={{ zIndex: -1 }}
                            ></div>
                        )}
                    </div>
                </div>
            </div>
        </Container>
    );
}
