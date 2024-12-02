import React from 'react';
import Container from '../_utils/Container';
import { twJoin, stripTags } from '@uniwebcms/module-sdk';

export default function (props) {
    const { block } = props;
    const { main } = block;

    const { title = '', subtitle = '', pretitle = '' } = main.header || {};

    const links = main.body?.links;
    const link = links?.[0];

    return (
        <Container>
            <div className="relative max-w-7xl mx-auto">
                <div
                    className={twJoin(
                        'relative z-10 flex flex-col w-full h-full min-h-[800px] max-h-full'
                    )}
                >
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
                                width: '100%',
                                paddingBottom: '56.25%',
                                height: 0,
                                marginTop: '2rem',
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
                                // sandbox="allow-same-origin allow-scripts"
                                loading="lazy"
                            ></iframe>
                        </div>
                    ) : null}
                </div>
            </div>
        </Container>
    );
}
