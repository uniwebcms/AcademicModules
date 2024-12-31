import React, { useState, useCallback, useEffect } from 'react';
import { twJoin, Image, getPageProfile, Link } from '@uniwebcms/module-sdk';

const LAYOUTS = {
    STACKED_3D: 'stacked3d',
    GRID: 'grid',
    MASONRY: 'masonry',
    CASCADE: 'cascade',
};

const PLAY_MODES = {
    AUTO: 'auto',
    NONE: 'none',
};

const ImageShowcase = ({
    images = [],
    layout = LAYOUTS.STACKED_3D,
    glassEffect = true,
    borderWidth = 6,
    gap = 4,
    hoverEffect = false, // Default to false for scale-up effect
    className = '',
    slideInterval = 3000,
    playMode = PLAY_MODES.AUTO,
    glassOpacity = 0.1,
    borderOpacity = 0.2,
    glassBlur = 8,
    glassSaturation = 100,
    shadowIntensity = 0.2,
}) => {
    // State
    const [activeIndices, setActiveIndices] = useState([...Array(images.length).keys()]);
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Animation control
    const rotateStack = useCallback(() => {
        if (isTransitioning) return; // Prevent multiple transitions

        setIsTransitioning(true);
        setActiveIndices((prev) => {
            const newIndices = [...prev];
            const first = newIndices.shift();
            newIndices.push(first);
            return newIndices;
        });

        setTimeout(() => {
            setIsTransitioning(false);
        }, 500);
    }, [isTransitioning]);

    // Handle auto-play mode
    useEffect(() => {
        if (layout === LAYOUTS.STACKED_3D && playMode === PLAY_MODES.AUTO) {
            const interval = setInterval(rotateStack, slideInterval);
            return () => clearInterval(interval);
        }
    }, [layout, playMode, rotateStack, slideInterval]);

    // Styles
    const glassStyles = glassEffect
        ? {
              backgroundColor: `rgba(255, 255, 255, ${glassOpacity})`,
              backdropFilter: `blur(${glassBlur}px) saturate(${glassSaturation}%)`,
              border: `${borderWidth}px solid rgba(255, 255, 255, ${borderOpacity})`,
              boxShadow: `0 10px 30px rgba(0, 0, 0, ${shadowIntensity})`,
          }
        : {};

    const getLayoutStyles = () => {
        switch (layout) {
            case LAYOUTS.STACKED_3D:
                return {
                    container: 'relative h-96 w-full',
                    imageWrapper: (index) => {
                        const position = activeIndices.indexOf(index);
                        const isMovingToBack = isTransitioning && position === images.length - 1;

                        return {
                            position: 'absolute',
                            left: '50%',
                            top: '50%',
                            width: '300px',
                            height: '200px',
                            transform: `
                  translate(-50%, -50%)
                  translateX(${position * 40}px)
                  translateY(${position * 20}px)
                  translateZ(${isMovingToBack ? '-50px' : '0'})
                  rotateX(10deg)
                  rotateY(-18deg)
                  rotateZ(0deg)
                  ${isMovingToBack ? 'scale(0.9)' : ''}
                `,
                            opacity: isMovingToBack ? 0.6 : 1,
                            boxShadow: `0 10px 30px rgba(0, 0, 0, 0.2)`, // Stronger shadow for 3D effect
                            zIndex: images.length - position,
                            transition: 'all 0.5s ease-out',
                        };
                    },
                };
            case LAYOUTS.CASCADE:
                return {
                    container: 'relative h-96 w-full flex items-center justify-center',
                    imageWrapper: (index) => ({
                        position: 'absolute',
                        transform: `translateX(${index * 40}px) translateY(${index * 20}px)`,
                        zIndex: images.length - index,
                        transition: 'transform 0.3s ease-out',
                    }),
                };
            case LAYOUTS.GRID:
                return {
                    container: `grid grid-cols-2 md:grid-cols-3 gap-${gap} p-4`,
                    imageWrapper: () => ({
                        transition: 'transform 0.3s ease-out',
                    }),
                };
            case LAYOUTS.MASONRY:
                return {
                    container: 'columns-2 md:columns-3 gap-4 p-4',
                    imageWrapper: () => ({
                        marginBottom: `${gap * 4}px`,
                        breakInside: 'avoid',
                        transition: 'transform 0.3s ease-out',
                    }),
                };
            default:
                return {
                    container: '',
                    imageWrapper: () => ({}),
                };
        }
    };

    const layoutStyles = getLayoutStyles();

    return (
        <div className={twJoin('w-full overflow-hidden', className, layoutStyles.container)}>
            {images.map((image, index) => (
                <div
                    key={index}
                    className={twJoin(
                        'rounded-lg overflow-hidden',
                        hoverEffect && 'hover:scale-105 transition-transform duration-300'
                    )}
                    style={{
                        ...glassStyles,
                        ...layoutStyles.imageWrapper(index),
                    }}
                >
                    <Image
                        profile={getPageProfile()}
                        value={image.value}
                        alt={image.alt}
                        url={image.url}
                        className="w-full h-full object-cover"
                    />
                </div>
            ))}
        </div>
    );
};

export default function ImageCarousel(props) {
    const { block, extra } = props;

    const className = extra?.className || '';

    const { banner, images } = block.getBlockContent();

    return (
        <ImageShowcase
            images={[banner, ...images].filter((image) => image)}
            layout={LAYOUTS.STACKED_3D}
            playMode={PLAY_MODES.HOVER}
            glassEffect={true}
            className={className}
        />
    );
}
