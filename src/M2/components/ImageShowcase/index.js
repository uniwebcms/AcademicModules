import React from 'react';
import { getPageProfile } from '@uniwebcms/module-sdk';
import { Image } from '@uniwebcms/core-components';

export default function ImageShowcase(props) {
    const { block } = props;

    const { title, banner, images } = block.getBlockContent();

    const image = banner || images[0];

    return (
        <div className="pt-[60px] pb-10 px-5">
            <div className="text-center">
                <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl">{title}</h2>
            </div>
            <div className="relative mt-12 max-w-[1400px] mx-auto">
                <div className="w-full aspect-video">
                    <Image
                        profile={getPageProfile()}
                        {...image}
                        className="w-full h-auto object-cover rounded-lg"
                    />
                </div>
            </div>
        </div>
    );
}
