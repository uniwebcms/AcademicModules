import React, { useRef, useEffect } from 'react';

export default function (props) {
    const { page, header, footer, body, leftPanel, rightPanel } = props;

    const containerRef = useRef(null);

    // Function to reset scroll position to the top of the container
    const resetScrollPosition = () => {
        if (containerRef.current) {
            containerRef.current.scrollTop = 0;
        }
    };

    useEffect(() => {
        resetScrollPosition();
    }, [page.options.pathname]);

    return (
        <div className={`bg-white w-screen min-h-screen`}>
            <div className={`h-[80px] bg-white sticky top-0 z-50`}>{header}</div>
            <div className={`relative flex max-w-8xl mx-auto px-8 md:px-12`}>
                <div
                    className={`sticky top-20 w-[300px] border-r hidden lg:flex flex-col bg-white h-[calc(100vh-80px)] overflow-y-auto`}
                >
                    {leftPanel}
                </div>
                <div className={`flex flex-1`} ref={containerRef}>
                    <div className={`flex h-full flex-grow flex-col px-8 md:px-12`}>
                        {body}
                        {footer}
                    </div>
                    <div className={`hidden md:block`}>{rightPanel}</div>
                </div>
            </div>
        </div>
    );
}
