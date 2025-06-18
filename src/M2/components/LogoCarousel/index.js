import React, { useRef, useEffect, useState } from 'react';
import { Image } from '@uniwebcms/core-components';

export default function LogoCarousel(props) {
    const { block, page } = props;

    // Destructure content and properties from the block
    const { title, images } = block.getBlockContent();
    const { speed = 'normal' } = block.getBlockProperties();

    // Define speed multipliers for animation duration
    const speedMultipliers = {
        slow: 1.5,
        normal: 1,
        fast: 0.6,
    };

    // Ref to the inner <ul> that holds one set of the logos.
    // We'll use this to precisely measure the width of one full set of items.
    const firstUlRef = useRef(null);

    // State to hold the dynamic CSS style properties for the animation.
    // This will include the animation duration and the transform-x value.
    const [animationCssVariables, setAnimationCssVariables] = useState({
        '--animation-duration': '0s', // Initialize with 0s to prevent animation until ready
        '--carousel-translate-x': '0px', // Initialize with 0px
    });

    // Effect hook to calculate the precise width and set animation properties.
    // This runs after images have likely rendered and laid out.
    useEffect(() => {
        // Ensure we have images and the ref is attached
        if (!images || images.length === 0 || !firstUlRef.current) {
            return;
        }

        // Create a ResizeObserver to watch for changes in the size of the first <ul>.
        // This is crucial because images might load asynchronously, and their dimensions
        // might not be available immediately on the first render.
        const resizeObserver = new ResizeObserver((entries) => {
            for (let entry of entries) {
                // The entry.contentRect.width gives us the *actual* rendered width
                // of the <ul> element that contains one set of logos.
                const currentWidth = entry.contentRect.width;

                if (currentWidth > 0) {
                    // Ensure width is valid (not 0)
                    // Calculate animation duration based on the actual width.
                    // We define a 'pixels per second' speed to keep the movement consistent.
                    const pixelsPerSecond = 50; // Adjust this value to control overall scroll speed
                    const calculatedDuration =
                        (currentWidth / pixelsPerSecond) * speedMultipliers[speed];

                    // Update the state with new CSS variable values.
                    // --animation-duration: controls the speed of the animation.
                    // --carousel-translate-x: the exact distance to translate the carousel by (one full set of logos).
                    setAnimationCssVariables({
                        '--animation-duration': `${calculatedDuration}s`,
                        '--carousel-translate-x': `-${currentWidth}px`,
                    });
                }
            }
        });

        // Start observing the first <ul> element.
        resizeObserver.observe(firstUlRef.current);

        // Cleanup function for the effect: disconnect the observer when the component unmounts.
        return () => {
            resizeObserver.disconnect();
        };
    }, [images, speed]); // Re-run effect if images list or speed prop changes.

    // Create a single set of carousel items (<li> elements).
    // This array will be duplicated in the render method to create the seamless loop.
    const carouselItems = images.map((image, index) => (
        <li key={index} className="inline-block mr-8 sm:mr-16 xl:mr-20">
            <Image
                profile={page.getPageProfile()}
                {...image}
                // Use object-contain for logos to ensure they are fully visible within their bounds.
                // Adjust height and max-width as needed.
                className="h-12 w-auto object-contain max-w-[120px] lg:max-w-[200px]"
            />
        </li>
    ));

    return (
        <div className="overflow-hidden py-8">
            <h2 className="text-base sm:text-lg lg:text-2xl mt-4 md:mt-12 mb-4 sm:mb-6 md:mb-10 text-center px-5">
                {title}
            </h2>

            <div className="relative overflow-hidden">
                {/*
                  The main animated container.
                  - flex: to arrange children (<ul>s) in a row.
                  - whitespace-nowrap: prevents text/inline elements from wrapping.
                  - will-change-transform: performance hint for browsers.
                  - style: Apply the dynamic CSS variables and animation property here.
                           The animation name 'scrollLeft' is defined in the <style> tag below.
                           We use a placeholder for duration until calculated.
                */}
                <div
                    className="flex whitespace-nowrap will-change-transform"
                    style={{
                        animation: `scrollLeft var(--animation-duration) linear infinite`,
                        ...animationCssVariables, // Spread the dynamically calculated CSS variables
                    }}
                >
                    {/*
                      First set of logos.
                      - ref={firstUlRef}: Attach the ref here to measure its width accurately.
                      - flex items-center: vertically centers logos within the ul.
                      - list-none p-0 m-0: removes default ul bullet points and padding/margin.
                    */}
                    <ul ref={firstUlRef} className="flex items-center list-none p-0 m-0">
                        {carouselItems}
                    </ul>
                    {/*
                      Second (duplicated) set of logos.
                      This is crucial for the seamless loop. When the first set moves out,
                      this identical set moves in without a visual jump.
                    */}
                    <ul className="flex items-center list-none p-0 m-0">{carouselItems}</ul>
                </div>
            </div>

            {/*
              Inline style block to define the CSS keyframes.
              Crucially, this keyframe now uses CSS variables for the 'to' transform value.
              This means the animation's end point can be controlled dynamically by React
              through the 'style' prop on the div above.
            */}
            <style>{`
                @keyframes scrollLeft {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(var(--carousel-translate-x)); }
                }
            `}</style>
        </div>
    );
}
