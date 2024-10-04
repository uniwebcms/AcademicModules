import React from 'react';
import { Image, twJoin, stripTags, getPageProfile } from '@uniwebcms/module-sdk';
import Container from '../_utils/Container';

function getColumnImages(array, numSubarrays) {
    const subarrays = Array.from({ length: numSubarrays }, () => []);

    const itemsPerSubarray = Math.ceil(array.length / numSubarrays);

    for (let i = 0; i < array.length; i++) {
        const subarrayIndex = Math.floor(i / itemsPerSubarray);
        subarrays[subarrayIndex].push(array[i]);
    }

    return subarrays;
}

export default function Gallery({ block }) {
    const { main } = block;

    const images = [];

    const { body, header, banner } = main || {};

    const { title = '' } = header || {};

    const alignment = main.header?.alignment || 'left';

    if (body?.imgs?.length) {
        images.push(...body.imgs);
    }

    if (banner) {
        images.unshift(banner);
    }

    if (!images.length) return null;

    const columnImages = getColumnImages(images, 4);

    return (
        <Container>
            <div className='max-w-7xl mx-auto'>
                <h2
                    className={twJoin(
                        'text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl',
                        `text-${alignment}`
                    )}>
                    {stripTags(title)}
                </h2>
                <div className='mt-8 md:mt-12 grid grid-cols-2 md:grid-cols-4 gap-4'>
                    {columnImages.map((column, index) => {
                        return (
                            <div className='grid gap-4' key={`col_${index}`}>
                                {column.map((image, index) => {
                                    return (
                                        <div key={`img_${index}`}>
                                            <Image
                                                profile={getPageProfile()}
                                                value={image.value}
                                                url={image.url}
                                                alt={image.alt}
                                                rounded='rounded-lg'
                                                className='h-auto max-w-full'
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </div>
        </Container>
    );
}
