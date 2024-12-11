import React from 'react';
import Container from '../_utils/Container';
import { Image, getPageProfile, Media } from '@uniwebcms/module-sdk';

export default function HeroMedia(props) {
    const { block } = props;

    const { banner, title, subtitle, videos } = block.getBlockContent();

    const video = videos[0];

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
            <div className="flex flex-col items-center justify-center mx-auto max-w-4xl">
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
                {video && (
                    <div className="w-full max-w-[44rem] mx-auto mt-8 lg:mt-16">
                        <Media
                            profile={getPageProfile()}
                            media={video}
                            className="rounded-3xl shadow-2xl"
                        />
                    </div>
                )}
            </div>
        </Container>
    );
}
