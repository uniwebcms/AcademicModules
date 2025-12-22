import React, { useEffect } from 'react';
import { Icon, SafeHtml } from '@uniwebcms/core-components';
import Container from '../_utils/Container';
import { twJoin } from '@uniwebcms/module-sdk';

export default function TimelineList(props) {
    const { block } = props;

    const { title, icons } = block.getBlockContent();
    const icon = icons[0];

    const items = block.getBlockItems();

    const { layout = 'edge-to-edge' } = block.getBlockProperties();

    // a way to remove the background color of the parent container, so the background color will not exceed the rounded corners
    useEffect(() => {
        if (layout === 'contained') {
            const parentElement = document.getElementById(`Section${block.id}`);

            if (parentElement) {
                parentElement.style.backgroundColor = 'transparent';
            }
        }
    }, [block.id, layout]);

    return (
        <Container
            className={twJoin(
                'w-full',
                layout === 'edge-to-edge'
                    ? 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'
                    : 'bg-bg-color p-6 rounded-[var(--border-radius)] border border-text-color/20'
            )}
        >
            <h3 className="font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-wide">
                <Icon icon={icon} className="w-4 h-4" /> <span>{title}</span>
            </h3>
            <ul className="space-y-4 text-sm">
                {items.map((item, index) => {
                    const { title, paragraphs } = item;

                    return (
                        <li key={index} className="flex gap-3">
                            <span className="font-mono text-primary-700 font-bold">{title}</span>
                            <SafeHtml value={paragraphs} />
                        </li>
                    );
                })}
            </ul>
        </Container>
    );
}
