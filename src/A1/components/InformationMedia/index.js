import React, { useRef } from 'react';
import { twJoin, getPageProfile } from '@uniwebcms/module-sdk';
import { SafeHtml, Media, Image } from '@uniwebcms/core-components';
import Container from '../_utils/Container';

export default function InformationMedia(props) {
    const { block } = props;
    const { main } = block;

    const { alignment = 'left', vertical_padding = 'lg' } = block.getBlockProperties();

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

    if (alignment == 'center') return Centered(props);

    const { title = '', subtitle = '', pretitle = '' } = main.header || {};

    const paragraphs = main.body?.paragraphs;
    const image = main.body?.imgs[0];
    const video = main.body?.videos[0];

    return (
        <Container py={py}>
            <div
                className={twJoin(
                    'relative max-w-7xl mx-auto px-6 lg:px-8 lg:flex',
                    alignment === 'right' ? 'lg:flex-row-reverse' : ''
                )}
            >
                <div
                    className={twJoin(
                        'w-full lg:w-1/2',
                        alignment === 'right' ? 'lg:ml-4 xl:ml-6' : 'lg:mr-4 xl:mr-6'
                    )}
                >
                    {pretitle && (
                        <SafeHtml
                            as="div"
                            value={pretitle}
                            className="mb-3 font-medium text-base md:text-lg lg:text-xl rich-text"
                        />
                    )}
                    {title && (
                        <SafeHtml
                            as="h2"
                            value={title}
                            className="text-2xl font-bold tracking-tight  md:text-3xl lg:text-4xl rich-text"
                        />
                    )}
                    {subtitle && (
                        <SafeHtml
                            as="h3"
                            value={subtitle}
                            className="mt-4 leading-8 text-base md:text-lg lg:text-xl text-text-color-80 rich-text"
                        />
                    )}

                    {paragraphs?.length ? (
                        <SafeHtml
                            className="mt-6 text-sm md:text-base lg:text-lg rich-text"
                            value={paragraphs}
                        />
                    ) : null}
                </div>
                <div
                    className={twJoin(
                        'w-full lg:w-1/2 flex items-center justify-center mt-8 lg:mt-0 min-h-[300px]',
                        alignment === 'right' ? 'lg:mr-4 xl:mr-6' : 'lg:ml-4 xl:ml-6'
                    )}
                >
                    <div className="w-full lg:max-w-lg xl:max-w-xl">
                        <Media
                            profile={getPageProfile()}
                            media={image && video ? video : video || image}
                            thumbnail={image && video ? image : undefined}
                        />
                        {image && image.caption ? (
                            <figcaption>
                                <div className="text-center mt-1.5 tracking-normal text-sm outline-none text-text-color/70">
                                    {image.caption}
                                </div>
                            </figcaption>
                        ) : null}
                    </div>
                </div>
            </div>
        </Container>
    );
}

const Centered = (props) => {
    const { block } = props;
    const { main } = block;

    const { title = '', pretitle = '', subtitle = '' } = main.header || {};

    const paragraphs = main.body?.paragraphs;
    const image = main.body?.imgs[0];
    const video = main.body?.videos[0];

    const containerRef = useRef(null);

    return (
        <section ref={containerRef} className={twJoin('py-24 sm:py-32 relative')}>
            <div className="mx-auto lg:max-w-7xl px-6 lg:px-8 text-center">
                {pretitle && (
                    <SafeHtml
                        as="div"
                        value={pretitle}
                        className="mb-3 font-medium text-base md:text-lg lg:text-xl rich-text"
                    />
                )}
                {title && (
                    <SafeHtml
                        as="h2"
                        value={title}
                        className="text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl rich-text"
                    />
                )}
                {subtitle && (
                    <SafeHtml
                        as="h3"
                        value={subtitle}
                        className="mt-4 leading-8 text-lg md:text-xl lg:text-2xl text-text-color-80 rich-text"
                    />
                )}

                {paragraphs?.length ? (
                    <SafeHtml
                        className="lg:columns-2 columns-1 gap-x-[60px] mt-12 text-base md:text-lg text-left text-text-color-90 rich-text"
                        value={paragraphs}
                    />
                ) : null}
            </div>
            {image && !video ? (
                <div className="relative overflow-hidden pt-16 lg:pt-20">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <Image
                            profile={getPageProfile()}
                            {...image}
                            className="object-cover mb-[-12%] rounded-xl shadow-2xl ring-1 ring-text-color-10"
                        />
                        <div className="relative" aria-hidden="true">
                            <div
                                className={twJoin(
                                    'absolute -inset-x-20 bottom-0 bg-gradient-to-t pt-[7%] from-bg-color to-transparent'
                                )}
                            />
                        </div>
                    </div>
                    {image.caption ? (
                        <figcaption className="absolute bottom-0 w-full bg-bg-color">
                            <div
                                className={`text-center mt-0.5 tracking-normal text-sm outline-none text-text-color/70`}
                            >
                                {image.caption}
                            </div>
                        </figcaption>
                    ) : null}
                </div>
            ) : null}
            {video ? (
                <div className="relative overflow-hidden pt-16 lg:pt-20">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <Media
                            profile={getPageProfile()}
                            media={video}
                            thumbnail={image || undefined}
                        />
                    </div>
                </div>
            ) : null}
        </section>
    );
};
