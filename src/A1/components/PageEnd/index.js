import React from 'react';

/**
 * Renders a wrapper for child footer components.
 *
 * @component SmartFooter
 * @prop {JSX} children
 * @returns {function} A react component.
 */
export default function PageEnd({ block }) {
    const { childBlocks } = block;

    const ChildBlocks = block.getChildBlockRenderer();

    return (
        <footer>
            <ChildBlocks block={block} childBlocks={childBlocks} as='div'></ChildBlocks>
        </footer>
    );
}
