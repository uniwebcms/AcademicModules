import React from 'react';
import { twMerge } from '@uniwebcms/module-sdk';

/**
 * A flexible section wrapper component that allows for the dynamic selection of the HTML element
 * to be rendered and merges TailwindCSS class names for padding and other customizations.
 *
 * @component
 *
 * @param {object} props - The properties passed to the component.
 * @param {string | React.ElementType} [props.as='section'] - The HTML element or custom React component to be rendered. Defaults to 'section'.
 * @param {React.ReactNode} [props.children] - The content to be rendered inside the component.
 * @param {string} [props.className=''] - Additional custom class names to apply to the component.
 * @param {string} [props.py='py-12 lg:py-24'] - Default padding classes for the Y-axis. Can be overridden.
 * @param {object} [props.rest] - Additional props to be passed to the component, like `id`, `style`, `aria-*` attributes, etc.
 *
 * @returns {JSX.Element} The rendered React component with the specified element, children, and class names.
 */
export default function ({
    as: Component = 'section',
    children,
    className = '',
    py = 'py-12 lg:py-24',
    ...rest
}) {
    return (
        <Component className={twMerge(`${py} relative`, className)} {...rest}>
            {children}
        </Component>
    );
}
