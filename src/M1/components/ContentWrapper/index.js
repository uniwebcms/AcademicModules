import React from 'react';
import Container from '../_utils/Container';
import { twJoin } from '@uniwebcms/module-sdk';
import { SafeHtml } from '@uniwebcms/core-components';

export default function ContentWrapper(props) {
    const { block } = props;
    const { title, subtitle, paragraphs } = block.getBlockContent();
    const { padding_vertical = 'regular' } = block.getBlockProperties();

    const ChildBlockRenderer = block.getChildBlockRenderer();

    const { childBlocks } = block;

    let pyClass = '';

    if (padding_vertical === 'none') {
        pyClass = 'none';
    } else if (padding_vertical === 'small') {
        pyClass = 'sm';
    } else if (padding_vertical === 'regular') {
        pyClass = 'md';
    }

    return (
        <Container py={pyClass} className="max-w-7xl mx-auto">
            <div className="max-w-3xl mx-auto">
                <div className={twJoin('text-center', 'mb-8')}>
                    <h2 className="text-4xl font-bold mb-3">{title}</h2>
                    <p className="text-lg">{subtitle}</p>
                </div>
                {childBlocks.length ? (
                    <ChildBlockRenderer
                        block={block}
                        childBlocks={childBlocks}
                    ></ChildBlockRenderer>
                ) : null}
                {paragraphs.length ? (
                    <SafeHtml
                        value={paragraphs}
                        className="mt-6 text-center text-sm text-[var(--muted)]"
                    />
                ) : null}
            </div>
        </Container>
    );
}
