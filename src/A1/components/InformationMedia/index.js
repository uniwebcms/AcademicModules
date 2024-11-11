import React, { useRef, useEffect, useState } from 'react';
import { Image, twJoin, SafeHtml, Media, stripTags, getPageProfile } from '@uniwebcms/module-sdk';
import Container from '../_utils/Container';

export default function InformationMedia(props) {
    const { block } = props;
    const { main } = block;

    const { alignment = 'left' } = block.getBlockProperties();

    if (alignment == 'center') return Centered(props);

    const { title = '', subtitle = '', pretitle = '' } = main.header || {};

    const paragraphs = main.body?.paragraphs;
    const image = main.body?.imgs[0];
    const video = main.body?.videos[0];

    return (
        <Container>
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
                    {pretitle ? (
                        <h3 className="mb-3 font-medium  text-lg md:text-xl lg:text-2xl">
                            {stripTags(pretitle)}
                        </h3>
                    ) : null}
                    <h2 className="text-2xl font-bold tracking-tight  md:text-3xl lg:text-4xl">
                        {stripTags(title)}
                    </h2>
                    {subtitle ? (
                        <h3 className="mt-4 leading-8 text-base md:text-lg lg:text-xl !text-neutral-900">
                            {stripTags(subtitle)}
                        </h3>
                    ) : null}
                    {paragraphs?.length ? (
                        <SafeHtml
                            className="mt-6 text-sm md:text-base lg:text-lg"
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
                    </div>
                </div>
            </div>
        </Container>
    );
}

const rgbToHex = (rgb) => {
    const rgbArray = rgb.match(/\d+/g);

    if (!rgbArray) {
        return null;
    }

    const hex = rgbArray.map((value) => {
        const hexValue = Number(value).toString(16);
        return hexValue.length === 1 ? `0${hexValue}` : hexValue;
    });

    return `#${hex.join('')}`;
};

const Centered = (props) => {
    const { block, website } = props;
    const { main } = block;

    const { title = '', pretitle = '', subtitle = '' } = main.header || {};

    const paragraphs = main.body?.paragraphs;
    const image = main.body?.imgs[0];
    const video = main.body?.videos[0];

    const containerRef = useRef(null);
    const [gradient, setGradient] = useState({});

    useEffect(() => {
        if (containerRef.current) {
            const computedStyle = window.getComputedStyle(containerRef.current);
            const backgroundColor = computedStyle.backgroundColor;

            const bgHex = rgbToHex(backgroundColor);
            if (bgHex) {
                const bgRgb = backgroundColor.replace(')', ' / 0)').replaceAll(',', '');

                setGradient({
                    '--tw-gradient-from': `${bgHex} var(--tw-gradient-from-position)`,
                    '--tw-gradient-to': `${bgRgb} var(--tw-gradient-to-position)`,
                    '--tw-gradient-stops': 'var(--tw-gradient-from), var(--tw-gradient-to)',
                });
            }
        }
    }, []);

    return (
        <section ref={containerRef} className={twJoin('py-24 sm:py-32 relative')}>
            <div className="mx-auto lg:max-w-7xl px-6 lg:px-8 text-center">
                {pretitle ? (
                    <h3 className="mb-3 font-medium  text-xl md:text-2xl lg:text-3xl">
                        {stripTags(pretitle)}
                    </h3>
                ) : null}
                <h2 className="text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl">
                    {stripTags(title)}
                </h2>
                {subtitle ? (
                    <h3 className="mt-4 leading-8 text-lg md:text-xl lg:text-2xl text-text-color-80">
                        {stripTags(subtitle)}
                    </h3>
                ) : null}
                {paragraphs?.length ? (
                    <SafeHtml
                        className="lg:columns-2 columns-1 gap-x-[60px] mt-12 text-base md:text-lg text-left text-text-color-90"
                        value={paragraphs}
                    />
                ) : null}
            </div>
            {image && !video ? (
                <div className="relative overflow-hidden pt-16 lg:pt-20">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <Image
                            profile={getPageProfile()}
                            value={image.value}
                            alt={image.alt}
                            url={image.url}
                            className="object-cover mb-[-12%] rounded-xl shadow-2xl ring-1 ring-text-color-10"
                        />
                        <div className="relative" aria-hidden="true">
                            <div
                                style={gradient}
                                className={twJoin(
                                    'absolute -inset-x-20 bottom-0 bg-gradient-to-t pt-[7%]'
                                )}
                            />
                        </div>
                    </div>
                </div>
            ) : null}
            {video ? (
                <div className="relative overflow-hidden pt-16 lg:pt-20">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <Media
                            profile={getPageProfile()}
                            media={image && video ? video : video || image}
                            thumbnail={image && video ? image : undefined}
                        />
                    </div>
                </div>
            ) : null}
        </section>
    );
};
