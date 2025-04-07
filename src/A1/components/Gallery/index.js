import React, { useState, useCallback, useEffect } from 'react';
import { Image, twJoin, stripTags, getPageProfile } from '@uniwebcms/module-sdk';
import Container from '../_utils/Container';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { HiX } from 'react-icons/hi';

function getColumnImages(array, numColumns) {
    const columns = Array.from({ length: numColumns }, () => []);

    array.forEach((item, index) => {
        const columnIndex = index % numColumns;
        columns[columnIndex].push(item);
    });

    return columns;
}

export default function Gallery({ block }) {
    const { main } = block;

    const { allow_fullscreen = true, max_column = 4 } = block.getBlockProperties();

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

    const [activeIndex, setActiveIndex] = useState(null);
    const [columnImages, setColumnImages] = useState([]);

    const closeViewer = useCallback(() => setActiveIndex(null), []);

    const showPrev = useCallback(() => {
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
    }, []);

    const showNext = useCallback(() => {
        setActiveIndex((prev) => (prev < images.length - 1 ? prev + 1 : prev));
    }, [images]);

    useEffect(() => {
        const handleResize = () => {
            let numOfColumns;

            if (max_column === 3) {
                numOfColumns = window.innerWidth < 640 ? 1 : window.innerWidth < 768 ? 2 : 3;
            } else if (max_column === 4) {
                numOfColumns =
                    window.innerWidth < 640
                        ? 1
                        : window.innerWidth < 768
                        ? 2
                        : window.innerWidth < 1024
                        ? 3
                        : 4;
            } else if (max_column === 5) {
                numOfColumns =
                    window.innerWidth < 640
                        ? 1
                        : window.innerWidth < 768
                        ? 2
                        : window.innerWidth < 1024
                        ? 3
                        : window.innerWidth < 1280
                        ? 4
                        : 5;
            }

            const newColumnImages = getColumnImages(images, numOfColumns);

            setColumnImages(newColumnImages);
        };
        handleResize(); // Call it once to set the initial state

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, [banner, body?.imgs, max_column]);

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
                <div
                    className={twJoin(
                        'mt-8 md:mt-12 grid gap-4 md:gap-5 lg:gap-6',
                        max_column === 3 && 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
                        max_column === 4 &&
                            'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
                        max_column === 5 &&
                            'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
                    )}
                >
                    {columnImages.map((column, index) => {
                        return (
                            <div
                                className="flex flex-col gap-y-4 md:gap-y-5 lg:gap-y-6"
                                key={`col_${index}`}
                            >
                                {column.map((image, index) => {
                                    return (
                                        <div
                                            key={`img_${index}`}
                                            onClick={
                                                allow_fullscreen
                                                    ? () => setActiveIndex(images.indexOf(image))
                                                    : null
                                            }
                                        >
                                            <Image
                                                profile={getPageProfile()}
                                                value={image.value}
                                                url={image.url}
                                                alt={image.alt}
                                                rounded="rounded-lg"
                                                className={twJoin(
                                                    'h-auto max-w-full',
                                                    allow_fullscreen && 'cursor-pointer'
                                                )}
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
                        className="absolute top-4 right-4 text-3xl transition"
                    >
                        <HiX className="text-gray-400 hover:text-white" />
                    </button>
                    <button
                        onClick={showPrev}
                        disabled={activeIndex === 0}
                        className={twJoin(
                            'absolute left-4 text-3xl transition z-10',
                            activeIndex === 0 && 'cursor-not-allowed'
                        )}
                    >
                        <FaChevronLeft
                            className={twJoin(
                                activeIndex === 0
                                    ? 'text-gray-500'
                                    : 'text-gray-300 hover:text-white'
                            )}
                        />
                    </button>
                    <Image
                        profile={getPageProfile()}
                        value={images[activeIndex].value}
                        url={images[activeIndex].url}
                        alt={images[activeIndex].alt}
                        className="h-[90vh] w-auto max-w-[95vw] max-h-[700px]"
                    />
                    <button
                        onClick={showNext}
                        disabled={activeIndex === images.length - 1}
                        className={twJoin(
                            'absolute right-4 text-3xl transition z-10',
                            activeIndex === images.length - 1 && 'cursor-not-allowed'
                        )}
                    >
                        <FaChevronRight
                            className={twJoin(
                                activeIndex === images.length - 1
                                    ? 'text-gray-500'
                                    : 'text-gray-300 hover:text-white'
                            )}
                        />
                    </button>
                </div>
            )}
        </Container>
    );
}
