import React, { forwardRef } from 'react';
import { twMerge } from '@uniwebcms/module-sdk';

export default forwardRef(
    ({ as: Component = 'section', children, className = '', maxWidth = '7xl', ...rest }, ref) => {
        const maxWidthMap = {
            xs: 'max-w-xs mx-auto',
            sm: 'max-w-sm mx-auto',
            md: 'max-w-md mx-auto',
            lg: 'max-w-lg mx-auto',
            xl: 'max-w-xl mx-auto',
            '2xl': 'max-w-2xl mx-auto',
            '3xl': 'max-w-3xl mx-auto',
            '4xl': 'max-w-4xl mx-auto',
            '5xl': 'max-w-5xl mx-auto',
            '6xl': 'max-w-6xl mx-auto',
            '7xl': 'max-w-7xl mx-auto',
            full: 'w-full',
            prose: 'max-w-prose mx-auto',
        };
        return (
            <Component
                className={twMerge(
                    'relative w-full @container ',
                    maxWidthMap[maxWidth] || maxWidth,
                    className
                )}
                {...rest}
                ref={ref}
            >
                {children}
            </Component>
        );
    }
);
