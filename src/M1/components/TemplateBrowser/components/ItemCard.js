import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import VideoPreview from './VideoPreview';
import IframePreview from './IframePreview';
import { twJoin, stripTags, website } from '@uniwebcms/module-sdk';
import { Link } from '@uniwebcms/core-components';
import ClipLoader from 'react-spinners/ClipLoader';

const ItemCard = React.memo(({ item }) => {
    const { useLocation } = website.getRoutingComponents();

    const [isHovering, setIsHovering] = useState(false);
    const [previewReady, setPreviewReady] = useState(false);
    const [coverImageLoaded, setCoverImageLoaded] = useState(false);
    const location = useLocation();

    // Use intersection observer to detect when card is visible
    const { ref: cardRef, inView } = useInView({
        threshold: 0,
    });

    // Reset cover image loaded state when item image changes
    useEffect(() => {
        setCoverImageLoaded(false);
    }, [item.image?.src]);

    const showPreview = item.preview;

    const handleMouseEnter = () => {
        setIsHovering(true);
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
    };

    const handlePreviewReady = useCallback(() => {
        setPreviewReady(true);
    }, []);

    // Memoize card content to prevent unnecessary re-renders
    const cardInfo = useMemo(() => {
        let { title, description } = item;

        description = description ? stripTags(description) : '';

        return (
            <div className={twJoin('block mt-2 px-1 py-1 relative space-y-0.5')}>
                <p
                    className={twJoin('text-base font-bold truncate group-hover:underline')}
                    title={title}
                >
                    {title}
                </p>
                {/* {item.href ? (
                    <Link to={item.href} className="text-base font-bold truncate hover:underline">
                        {title}
                    </Link>
                ) : (
                    <p className="text-base font-bold truncate" title={title}>
                        {title}
                    </p>
                )} */}
                <p className="truncate text-sm text-text-color/70 h-5" title={description}>
                    {description}
                </p>
            </div>
        );
    }, [item]);

    return (
        <div
            ref={cardRef}
            className="relative group p-2 rounded-lg hover:shadow-md"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Static Image */}
            <div
                className={`relative w-full aspect-video transition-opacity duration-300 overflow-hidden ${
                    isHovering && previewReady ? 'opacity-0 rounded-none' : 'opacity-100 rounded-lg'
                }`}
            >
                {!coverImageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-neutral-100 rounded-lg z-10">
                        <ClipLoader color="rgb(var(--primary-500))" size={24} />
                    </div>
                )}
                <img
                    src={item.image.src}
                    alt={item.image.alt}
                    className="w-full h-full object-cover"
                    onLoad={() => setCoverImageLoaded(true)}
                />
            </div>

            {/* Video Preview - Only render if in view */}
            {inView && showPreview && (
                <div
                    className={`absolute inset-2 transition-opacity duration-300 ${
                        isHovering && previewReady ? 'opacity-100' : 'opacity-0'
                    }`}
                >
                    {item.preview.type === 'video' ? (
                        <VideoPreview
                            src={item.preview.src}
                            inView={inView}
                            isHovered={isHovering}
                            onReady={handlePreviewReady}
                        />
                    ) : (
                        <IframePreview
                            src={item.preview.src}
                            type={item.preview.type}
                            inView={inView}
                            isHovered={isHovering}
                            onReady={handlePreviewReady}
                        />
                    )}
                </div>
            )}

            {/* Card Info */}
            {cardInfo}

            {/* Overlay for link click */}
            {item.href && (
                <Link to={`${item.href}${location.search}`} className="absolute inset-0 z-[1]" />
            )}
        </div>
    );
});

export default ItemCard;
