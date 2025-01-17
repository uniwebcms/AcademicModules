import React, { useState, useEffect, useRef } from 'react';

/**
 * Generates a unique ID.
 * @returns {string} An id like "iframe-luvbwyya-w27e6".
 */
const uniqueId = () => {
    const timestamp = Date.now().toString(36); // Convert current timestamp to base36 string
    const randomString = Math.random().toString(36).substring(2, 7); // Generate a random string
    return `iframe-${timestamp}-${randomString}`;
};

/**
 * FrameLoader is a React component that wraps an iframe, ensuring
 * it's loaded and ready to display before rendering. It provides
 * an option to display a loading animation while the iframe is loading.
 * It also executes an provided callback when the iframe is fully loaded.
 *
 * @param {Object} props - Component props.
 * @param {string} props.src - The source URL for the iframe.
 * @param {React.ReactNode} props.loadingAnimation - The loading animation to display while the iframe is loading.
 * @param {Function} props.onReady - A callback. onReady(iframeWindow) is called when the iframe is fully loaded.
 * @param {boolean} props.allowFullScreen - Whether to allow the iframe to go fullscreen (default is false).
 * @param {string} props.width - The width of the iframe (default is '100%').
 * @param {string} props.height - The height of the iframe (default is '400px').
 * @param {string|array} props.sandbox - Sand boxing flags for added security (e.g., 'allow-scripts' or ['allow-scripts', 'allow-same-origin']).
 * @param {string} props.title - A title for the iframe (default is '').
 * @param {string} props.name - A name for the iframe (default is '').
 * @param {string} props.loading - How the iframe's content should be loaded ('eager' or 'lazy', default is 'eager').
 * @param {string} props.referrerPolicy - The referrer policy for the iframe (e.g., 'no-referrer' or 'no-referrer-when-downgrade', default is '').
 * @param {string} props.className - Classes to apply to the iframe element (default is '').
 * @returns {JSX.Element} The FrameLoader component.
 */
const FrameLoader = (props) => {
    let {
        id,
        src,
        loadingAnimation,
        colorTheme = 'dark',
        onReady,
        className = '',
        style = {},
        sandbox = 'allow-scripts allow-same-origin allow-downloads allow-modals',
    } = props;

    const [iframeLoaded, setIframeLoaded] = useState(false);
    const iframeRef = useRef(null);

    const bgColor = colorTheme === 'dark' ? 'bg-[rgba(0,0,0,0.85)]' : 'bg-[rgba(255,255,255,0.85)]';

    // Set a default loading animation
    loadingAnimation ??= (
        <div className={`flex justify-center items-center h-full w-full ${bgColor}`}>
            <div
                className={`animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500`}
            ></div>
        </div>
    );

    useEffect(() => {
        /**
         * Handles the 'load' event of the iframe.
         */
        const handleIframeLoad = () => {
            const iframeWindow = iframeRef.current.contentWindow;
            // Two ways of getting the document that work with older conventions
            // Most modern browsers support the first condition (DOM element).
            const iframeDocument = iframeRef.current.contentDocument || iframeWindow?.document;
            const isRestricted = iframeWindow && !iframeDocument;

            // uniweb.log('Has document', !!iframeDocument);

            // If the iframe's document is ready, mark it as loaded
            if (isRestricted || iframeDocument?.readyState === 'complete') {
                setIframeLoaded(true);
                if (onReady) onReady(iframeWindow);
            }
        };

        if (iframeRef.current) {
            // Add the event listener to the iframe
            iframeRef.current.addEventListener('load', handleIframeLoad);

            return () => {
                // Remove the event listener when the component unmounts
                if (iframeRef.current)
                    iframeRef.current.removeEventListener('load', handleIframeLoad);
            };
        }
    }, [iframeRef.current, onReady]);

    useEffect(() => {
        setIframeLoaded(false);
    }, [src]);

    let attrs = [
        'allowFullScreen',
        'width',
        'height',
        'title',
        'name',
        'loading',
        'referrerPolicy',
    ];

    let frameProps = {};

    attrs.forEach((item) => {
        if (typeof props?.[item] !== 'undefined') {
            frameProps[item] = props[item];
        }
    });

    if (sandbox) frameProps.sandbox = sandbox;

    if (!id) id = uniqueId();

    return (
        <>
            {!iframeLoaded && loadingAnimation}
            <iframe
                id={id}
                ref={iframeRef}
                src={src}
                className={!iframeLoaded ? `absolute opacity-0 w-0 h-0 border-none` : className}
                {...frameProps}
                style={!iframeLoaded ? {} : style}
            />
        </>
    );
};

export default FrameLoader;
