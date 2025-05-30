import React, { useState, useCallback, useEffect } from 'react';
import { twJoin, stripTags, getPageProfile } from '@uniwebcms/module-sdk';
import { Image } from '@uniwebcms/core-components';
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

function Masonry({
    images,
    imageSize,
    imageRatio,
    imageBorderRadius,
    allowFullscreen,
    setActiveImage,
}) {
    const [columnImages, setColumnImages] = useState([]);

    useEffect(() => {
        const handleResize = () => {
            let numOfColumns;

            if (imageSize === 'large') {
                numOfColumns = window.innerWidth < 640 ? 1 : window.innerWidth < 768 ? 2 : 3;
            } else if (imageSize === 'medium') {
                numOfColumns =
                    window.innerWidth < 640
                        ? 1
                        : window.innerWidth < 768
                        ? 2
                        : window.innerWidth < 1024
                        ? 3
                        : 4;
            } else if (imageSize === 'small') {
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
    }, [images, imageSize]);

    return (
        <div
            className={twJoin(
                'mt-8 md:mt-12 grid gap-4',
                imageSize === 'large' && 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
                imageSize === 'medium' &&
                    'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
                imageSize === 'small' &&
                    'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
            )}
        >
            {columnImages.map((column, index) => {
                return (
                    <div className="flex flex-col gap-y-4" key={`col_${index}`}>
                        {column.map((image, index) => {
                            return (
                                <div
                                    key={`img_${index}`}
                                    onClick={allowFullscreen ? () => setActiveImage(image) : null}
                                >
                                    <Image
                                        profile={getPageProfile()}
                                        value={image.value}
                                        url={image.url}
                                        alt={image.alt}
                                        rounded={
                                            imageBorderRadius === 'small'
                                                ? 'rounded-sm'
                                                : imageBorderRadius === 'medium'
                                                ? 'rounded-md'
                                                : imageBorderRadius === 'large'
                                                ? 'rounded-lg'
                                                : ''
                                        }
                                        className={twJoin(
                                            'max-w-full',
                                            allowFullscreen && 'cursor-pointer',
                                            imageRatio === 'auto'
                                                ? 'h-auto'
                                                : imageRatio === 'square'
                                                ? 'h-auto aspect-square'
                                                : imageRatio === 'portrait'
                                                ? 'h-auto aspect-[9/16]'
                                                : imageRatio === 'landscape'
                                                ? 'h-auto aspect-[16/9]'
                                                : ''
                                        )}
                                    />
                                </div>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
}

function Thumbnail({
    images,
    imageSize,
    imageRatio,
    imageBorderRadius,
    allowFullscreen,
    setActiveImage,
}) {
    const sizeMap = {
        small: 'w-20',
        medium: 'w-28',
        large: 'w-36',
    };

    const ratioMap = {
        square: 'aspect-square',
        portrait: 'aspect-[3/4]',
        landscape: 'aspect-[4/3]',
        auto: 'aspect-auto',
    };

    return (
        <div className={twJoin('mt-8 md:mt-12 flex flex-wrap gap-2')}>
            {images.map((image, index) => {
                return (
                    <div
                        key={`img_${index}`}
                        onClick={allowFullscreen ? () => setActiveImage(image) : null}
                        className={twJoin(
                            'overflow-hidden',
                            sizeMap[imageSize],
                            ratioMap[imageRatio]
                        )}
                    >
                        <Image
                            profile={getPageProfile()}
                            value={image.value}
                            url={image.url}
                            alt={image.alt}
                            rounded={
                                imageBorderRadius === 'small'
                                    ? 'rounded-sm'
                                    : imageBorderRadius === 'medium'
                                    ? 'rounded-md'
                                    : imageBorderRadius === 'large'
                                    ? 'rounded-lg'
                                    : ''
                            }
                            className={allowFullscreen && 'cursor-pointer'}
                        />
                    </div>
                );
            })}
        </div>
    );
}

export default function Gallery({ block }) {
    const { main } = block;

    const {
        allow_fullscreen = true,
        mode = 'masonry',
        image_size = 'medium',
        image_ratio = 'auto',
        image_border_radius = 'none',
        vertical_padding = 'lg',
    } = block.getBlockProperties();

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

    return (
        <Container py={py}>
            <div className="px-6 mx-auto max-w-7xl lg:px-8">
                <h2
                    className={twJoin(
                        'text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl',
                        `text-${alignment}`
                    )}
                >
                    {stripTags(title)}
                </h2>
                {mode === 'masonry' ? (
                    <Masonry
                        images={images}
                        imageSize={image_size}
                        imageRatio={image_ratio}
                        imageBorderRadius={image_border_radius}
                        allowFullscreen={allow_fullscreen}
                        setActiveImage={(image) => setActiveIndex(images.indexOf(image))}
                    />
                ) : (
                    <Thumbnail
                        images={images}
                        imageSize={image_size}
                        imageRatio={image_ratio}
                        imageBorderRadius={image_border_radius}
                        allowFullscreen={allow_fullscreen}
                        setActiveImage={(image) => setActiveIndex(images.indexOf(image))}
                    />
                )}
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
                    <div className="flex flex-col items-center gap-2">
                        <Image
                            profile={getPageProfile()}
                            value={images[activeIndex].value}
                            url={images[activeIndex].url}
                            alt={images[activeIndex].alt}
                            className="h-[90vh] w-auto max-w-[95vw] max-h-[700px]"
                        />
                        <div className="h-10">
                            {images[activeIndex].caption && (
                                <figcaption>
                                    <div
                                        className="text-center tracking-normal text-sm outline-none text-white line-clamp-2"
                                        title={images[activeIndex].caption}
                                    >
                                        {images[activeIndex].caption}
                                    </div>
                                </figcaption>
                            )}
                        </div>
                    </div>
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
