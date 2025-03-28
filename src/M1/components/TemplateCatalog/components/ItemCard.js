import React, { useState, useCallback, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import VideoPreview from './VideoPreview';
import IframePreview from './IframePreview';
import { Link, twJoin, stripTags } from '@uniwebcms/module-sdk';

const ItemCard = React.memo(({ item }) => {
    const [isHovering, setIsHovering] = useState(false);
    const [previewReady, setPreviewReady] = useState(false);

    // Use intersection observer to detect when card is visible
    const { ref: cardRef, inView } = useInView({
        threshold: 0,
    });

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
    const cardContent = useMemo(() => {
        const { title, description } = item;

        const Wrapper = item.href ? Link : 'div';
        const wrapperProps = item.href ? { to: item.href } : {};

        return (
            <Wrapper
                className={twJoin(
                    'my-2 px-2 py-2 relative z-[1]',
                    item.href ? 'hover:underline cursor-pointer' : ''
                )}
                {...wrapperProps}
            >
                <p className={twJoin('text-sm truncate')}>
                    <span className="font-bold">{title}</span>
                    {title && description ? ' – ' : ''}
                    <span>{stripTags(description)}</span>
                </p>
            </Wrapper>
        );
    }, [item]);

    return (
        <div
            ref={cardRef}
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Static Image */}
            <div
                className={`relative w-full aspect-video transition-opacity duration-300 overflow-hidden ${
                    isHovering && previewReady ? 'opacity-0 rounded-none' : 'opacity-100 rounded-lg'
                }`}
            >
                <img
                    src={item.image.src}
                    alt={item.image.alt}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Video Preview - Only render if in view */}
            {inView && showPreview && (
                <div
                    className={`absolute inset-0 transition-opacity duration-300 ${
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

            {/* Card Content */}
            {cardContent}

            {/* Overlay for link click */}
            {/* {item.href && <Link to={item.href} className="absolute inset-0 z-[1]" />} */}
        </div>
    );
});

export default ItemCard;
