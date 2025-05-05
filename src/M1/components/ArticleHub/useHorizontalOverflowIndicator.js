import { useEffect, useState, useRef } from 'react';

export function useHorizontalOverflowIndicator() {
    const ref = useRef(null);
    const [hasOverflow, setHasOverflow] = useState(false);
    const [showIndicator, setShowIndicator] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const checkOverflow = () => {
            if (!element) return;
            const scrollable = element.scrollWidth > element.clientWidth;
            setHasOverflow(scrollable);
            if (scrollable) {
                setShowIndicator(element.scrollLeft + element.clientWidth < element.scrollWidth);
            } else {
                setShowIndicator(false);
            }
        };

        const handleScroll = () => {
            if (!element) return;
            const atEnd = element.scrollLeft + element.clientWidth >= element.scrollWidth - 1;
            setShowIndicator(!atEnd);
        };

        checkOverflow();
        element.addEventListener('scroll', handleScroll);

        const resizeObserver = new ResizeObserver(checkOverflow);
        resizeObserver.observe(element);

        window.addEventListener('resize', checkOverflow);

        return () => {
            element.removeEventListener('scroll', handleScroll);
            resizeObserver.disconnect();
            window.removeEventListener('resize', checkOverflow);
        };
    }, []);

    return [ref, hasOverflow, showIndicator];
}
