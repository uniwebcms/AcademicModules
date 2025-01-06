import React from 'react';
import Container from '../_utils/Container';
import { Image, getPageProfile, Media, SafeHtml, twJoin } from '@uniwebcms/module-sdk';

export default function MediaHero(props) {
    const { block } = props;

    const { banner, title, subtitle, paragraphs, videos, images } = block.getBlockContent();

    const video = videos[0];
    const image = images[0];

    return (
        <Container className="w-screen min-h-96" py="lg">
            {banner && (
                <div className="absolute inset-0">
                    <Image
                        profile={getPageProfile()}
                        {...banner}
                        className="object-cover w-full h-full"
                    />
                </div>
            )}
            <div className="relative flex flex-col items-center justify-center mx-auto max-w-4xl z-10">
                {title && (
                    <h1
                        className="text-3xl font-semibold md:text-4xl lg:text-5xl text-center tracking-wide text-pretty"
                        style={{
                            lineHeight: '1.1',
                        }}
                    >
                        {title}
                    </h1>
                )}
                {subtitle && (
                    <h2 className="mt-4 lg:mt-6 px-0 lg:px-8 text-lg md:text-xl lg:text-2xl font-light text-center tracking-wide text-pretty">
                        {subtitle}
                    </h2>
                )}
                {paragraphs.length ? (
                    <SafeHtml
                        value={paragraphs}
                        className="mt-4 lg:mt-6 lg:px-8 text-lg lg:text-xl text-center tracking-wide text-pretty"
                    >
                        {subtitle}
                    </SafeHtml>
                ) : null}
                {video || image ? (
                    <div
                        className={twJoin(
                            'w-full mx-auto mt-8',
                            video ? 'lg:mt-16 max-w-[44rem]' : 'lg:mt-10 max-w-2xl'
                        )}
                    >
                        <Media
                            profile={getPageProfile()}
                            media={video || image}
                            className={twJoin('shadow-2xl', video ? 'rounded-3xl' : '')}
                        />
                    </div>
                ) : null}
            </div>
        </Container>
    );
}
