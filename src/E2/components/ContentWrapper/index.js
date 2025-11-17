import React from 'react';

export default function ContentWrapper({ block }) {
    const { childBlocks } = block;

    const ChildBlocks = block.getChildBlockRenderer();

    const { width = 'medium' } = block.getBlockProperties();

    const maxWidthClass = {
        small: 'max-w-3xl',
        medium: 'max-w-4xl',
        large: 'max-w-5xl',
        xlarge: 'max-w-6xl',
    }[width];

    return (
        <div className={`${maxWidthClass} mx-auto p-4 md:p-8 lg:p-12`}>
            <ChildBlocks block={block} childBlocks={childBlocks} />
        </div>
    );
}
