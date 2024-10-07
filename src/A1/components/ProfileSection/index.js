import React from 'react';
import Container from '../_utils/Container';
import { SafeHtml, twJoin } from '@uniwebcms/module-sdk';

export default function ProfileSection({ input, block }) {
    if (!input) return null;

    let sectionData = input.data;

    const { mainHeader } = block;

    sectionData = sectionData && typeof sectionData === 'string' ? sectionData : '';

    const { width = 'lg', columns = '1' } = block.getBlockProperties();

    return (
        <Container
            className={twJoin(
                'px-6 mx-auto lg:px-8',
                width === 'md' && 'max-w-2xl',
                width === 'lg' && 'max-w-3xl',
                width === 'xl' && 'max-w-5xl',
                width === '2xl' && 'max-w-7xl'
            )}>
            <h2 className={twJoin('text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl mx-auto')}>
                {mainHeader?.title}
            </h2>
            <SafeHtml
                value={sectionData}
                className={twJoin(
                    'mt-8 text-base leading-8 lg:leading-9 md:text-lg lg:text-xl mx-auto space-y-4 lg:space-y-6 lg:gap-16 xl:gap-20',
                    columns == '1' && 'columns-1',
                    columns == '2' && 'columns-1 lg:columns-2',
                    columns == '3' && 'columns-1 lg:columns-2 xl:columns-3'
                )}></SafeHtml>
        </Container>
    );
}
