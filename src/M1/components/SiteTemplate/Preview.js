import React, { useState, useRef, useLayoutEffect } from 'react';
import FrameLoader from './FrameLoader';

export default function (props) {
    const { iframeSrc, screen, isMobileLayout } = props;

    // This logic remains the same
    const iframeSize =
        screen === 'desktop'
            ? `w-full h-full shadow-none transform`
            : `${
                  isMobileLayout ? 'w-full h-full' : 'h-[80vh] w-[430px]'
              } border !shadow-xl rounded`;

    const previewContainerRef = useRef(null);

    // --- 1. CHANGE ---
    // Change state to hold a style object, not a string
    const [scaleStyle, setScaleStyle] = useState({});

    useLayoutEffect(() => {
        const container = previewContainerRef.current;

        if (screen !== 'desktop' || !container) {
            // --- 2. CHANGE ---
            // Reset style object
            setScaleStyle({});
            return;
        }

        const observer = new ResizeObserver((entries) => {
            if (!entries || !entries.length) {
                return;
            }
            const { width } = entries[0].contentRect;
            const scale = width / 1440;
            const h = (100 / scale).toFixed(2);

            // --- 3. CHANGE ---
            // Set the state with the dynamic style object
            setScaleStyle({
                transform: `scale(${scale})`,
                height: `${h}%`,
                // We also keep the static width here
                width: '1440px',
            });
        });

        observer.observe(container);

        return () => {
            observer.disconnect();
        };
    }, [screen]);

    return (
        <div
            className={`rounded-md flex-1 ${
                isMobileLayout ? '' : 'h-full'
            } flex items-center justify-center overflow-hidden relative bg-black`}
            style={{ outline: '1px solid rgb(100,100,100)' }}
            ref={previewContainerRef}
        >
            <FrameLoader
                src={iframeSrc}
                // --- 4. CHANGE (className) ---
                // The className now only contains static classes
                className={`${iframeSize} ${
                    screen === 'desktop'
                        ? // All static classes for desktop mode go here
                          // Note: `!w-[1440px]` is moved to the style prop
                          `absolute left-0 top-0 origin-top-left`
                        : ''
                }`}
                // --- 5. CHANGE (style) ---
                // The dynamic styles are applied here
                style={screen === 'desktop' ? scaleStyle : {}}
            ></FrameLoader>
        </div>
    );
}
