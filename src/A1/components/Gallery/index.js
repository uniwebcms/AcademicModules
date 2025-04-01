import React, { useState, useCallback, useEffect } from 'react';
import { Image, twJoin, stripTags, getPageProfile } from '@uniwebcms/module-sdk';
import Container from '../_utils/Container';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { HiX } from 'react-icons/hi';

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

    const columnImages = getColumnImages(images, 4);

    const [activeIndex, setActiveIndex] = useState(null);

    const closeViewer = useCallback(() => setActiveIndex(null), []);

    const showPrev = useCallback(() => {
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
    }, []);

    const showNext = useCallback(() => {
        setActiveIndex((prev) => (prev < images.length - 1 ? prev + 1 : prev));
    }, [images]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (activeIndex === null) return;
            if (e.key === 'Escape') closeViewer();
            if (e.key === 'ArrowLeft') showPrev();
            if (e.key === 'ArrowRight') showNext();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeIndex, closeViewer, showPrev, showNext]);

    if (!images.length) return null;

    return (
        <Container>
            <div className="px-6 mx-auto max-w-7xl lg:px-8">
                <h2
                    className={twJoin(
                        'text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl',
                        `text-${alignment}`
                    )}
                >
                    {stripTags(title)}
                </h2>
                <div className="mt-8 md:mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4">
                    {columnImages.map((column, index) => {
                        return (
                            <div className="flex flex-col gap-y-4" key={`col_${index}`}>
                                {column.map((image, index) => {
                                    return (
                                        <div
                                            key={`img_${index}`}
                                            onClick={() => setActiveIndex(images.indexOf(image))}
                                        >
                                            <Image
                                                profile={getPageProfile()}
                                                value={image.value}
                                                url={image.url}
                                                alt={image.alt}
                                                rounded="rounded-lg"
                                                className="h-auto max-w-full cursor-pointer"
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </div>
            {activeIndex !== null && (
                <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
                    <button
                        onClick={closeViewer}
                        className="absolute top-4 right-4 text-gray-400 text-3xl hover:text-white transition"
                    >
                        <HiX />
                    </button>
                    <button
                        onClick={showPrev}
                        disabled={activeIndex === 0}
                        className={twJoin(
                            'absolute left-4 text-3xl transition z-10',
                            activeIndex === 0
                                ? 'text-gray-500 cursor-not-allowed'
                                : 'text-gray-300 hover:text-white'
                        )}
                    >
                        <FaChevronLeft />
                    </button>
                    <Image
                        profile={getPageProfile()}
                        value={images[activeIndex].value}
                        url={images[activeIndex].url}
                        alt={images[activeIndex].alt}
                        className="h-[90vh] w-auto max-w-[95vw]"
                    />
                    <button
                        onClick={showNext}
                        disabled={activeIndex === images.length - 1}
                        className={twJoin(
                            'absolute right-4 text-3xl transition z-10',
                            activeIndex === images.length - 1
                                ? 'text-gray-500 cursor-not-allowed'
                                : 'text-gray-300 hover:text-white'
                        )}
                    >
                        <FaChevronRight />
                    </button>
                </div>
            )}
        </Container>
    );
}
