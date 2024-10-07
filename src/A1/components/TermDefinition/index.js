import React from 'react';
import Container from '../_utils/Container';
import { Icon, SafeHtml, twJoin, stripTags } from '@uniwebcms/module-sdk';

export default function TermDefinition(props) {
    const { block } = props;

    const { title = '', subtitle = '' } = block.main.header || {};

    const items = block.getBlockItems();

    return (
        <Container className='space-y-8 sm:space-y-12 px-6 md:px-8'>
            <div className='max-w-4xl mx-auto lg:text-center lg:max-w-5xl space-y-4'>
                <h2 className='text-6xl font-bold tracking-tight'>{stripTags(title)}</h2>
                {subtitle ? <h3 className='text-lg leading-8 text-text-color-80'>{stripTags(subtitle)}</h3> : null}
            </div>
            <div className='max-w-7xl mx-auto divide-y divide-text-color-30 overflow-hidden rounded-lg bg-text-color-10 shadow-lg sm:grid sm:grid-cols-2 sm:gap-px sm:divide-y-0'>
                {items.map((item, index) => {
                    const { title, paragraphs, icons } = item;

                    const icon = icons[0];

                    return (
                        <div
                            key={index}
                            className={twJoin(
                                'space-y-8',
                                'group relative bg-text-color-20 p-6 hover:bg-text-color-10'
                            )}>
                            {icon && (
                                <div className='inline-flex rounded-lg p-3 ring-4 ring-text-color-30 bg-text-color-10'>
                                    <Icon icon={icon} className='w-6 h-6' />
                                </div>
                            )}
                            <div>
                                <h3 className='text-base font-semibold leading-6'>{stripTags(title)}</h3>
                                <SafeHtml className='mt-2 text-sm text-text-color-80' value={paragraphs} />
                            </div>
                        </div>
                    );
                })}
            </div>
        </Container>
    );
}
