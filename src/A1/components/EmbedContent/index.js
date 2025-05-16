import React from 'react';
import Container from '../_utils/Container';
import { twJoin, stripTags } from '@uniwebcms/module-sdk';

export default function (props) {
    const { block } = props;
    const { main } = block;

    const { title = '', subtitle = '', pretitle = '' } = main.header || {};

    const links = main.body?.links;
    const link = links?.[0];

    const { vertical_padding = 'lg', iframe_height: rawHeight = '' } = block.getBlockProperties();

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

    const validHeight =
        typeof rawHeight === 'string' && /^\d+(\.\d+)?(px|%|vh)$/.test(rawHeight.trim())
            ? rawHeight.trim()
            : '56.25%';

    return (
        <Container py={py}>
            <div className="relative max-w-7xl mx-auto">
                <div className="relative z-10 flex flex-col w-full">
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
                    {link ? (
                        <div
                            style={{
                                width: '100%',
                                position: 'relative',
                                marginTop: '2rem',
                                height: validHeight,
                                minHeight: '600px',
                            }}
                        >
                            <iframe
                                src={link.href}
                                className=""
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    border: 'none',
                                }}
                                loading="lazy"
                            ></iframe>
                        </div>
                    ) : null}
                </div>
            </div>
        </Container>
    );
}
