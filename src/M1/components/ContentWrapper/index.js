import React from 'react';
import Container from '../_utils/Container';
import { SafeHtml, twJoin } from '@uniwebcms/module-sdk';

export default function ContentWrapper(props) {
    const { block } = props;
    const { title, subtitle, paragraphs } = block.getBlockContent();

    const { as_hero = false } = block.getBlockProperties();

    const ChildBlockRenderer = block.getChildBlockRenderer();

    const { childBlocks } = block;

    const heading = title ? (
        as_hero ? (
            <h1 className="text-4xl md:text-5xl font-light mb-4">{title}</h1>
        ) : (
            <h2 className="text-4xl font-bold mb-3">{title}</h2>
        )
    ) : null;

    return (
        <Container className="max-w-7xl mx-auto">
            <div className="max-w-3xl mx-auto">
                <div className={twJoin('text-center', as_hero ? 'mb-12' : 'mb-8')}>
                    {heading}
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
