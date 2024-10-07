import React from 'react';
import Container from '../_utils/Container';
import { twJoin } from '@uniwebcms/module-sdk';
import './style.css';

const layouts = {
    left: {
        '50/50': 'flex flex-col w-full lg:w-1/2 px-4 lg:pr-0 lg:pl-6 xl:pl-8',
        '40/60': 'flex flex-col w-full lg:w-[40%] px-4 lg:pr-0 lg:pl-6 xl:pl-8',
        '60/40': 'flex flex-col w-full lg:w-[60%] px-4 lg:pr-0 lg:pl-6 xl:pl-8',
        '70/30': 'flex flex-col w-full lg:w-[70%] px-4 lg:pr-0 lg:pl-6 xl:pl-8',
        '30/70': 'flex flex-col w-full lg:w-[30%] px-4 lg:pr-0 lg:pl-6 xl:pl-8',
        '75/25': 'flex flex-col w-full lg:w-[75%] px-4 lg:pr-0 lg:pl-6 xl:pl-8',
        '25/75': 'flex flex-col w-full lg:w-[25%] px-4 lg:pr-0 lg:pl-6 xl:pl-8'
    },
    right: {
        '50/50': 'flex flex-col w-full lg:w-1/2 px-4 lg:pl-0 lg:pr-6 xl:pr-8',
        '40/60': 'flex flex-col w-full lg:w-[60%] px-4 lg:pl-0 lg:pr-6 xl:pr-8',
        '60/40': 'flex flex-col w-full lg:w-[40%] px-4 lg:pl-0 lg:pr-6 xl:pr-8',
        '70/30': 'flex flex-col w-full lg:w-[30%] px-4 lg:pl-0 lg:pr-6 xl:pr-8',
        '30/70': 'flex flex-col w-full lg:w-[70%] px-4 lg:pl-0 lg:pr-6 xl:pr-8',
        '75/25': 'flex flex-col w-full lg:w-[25%] px-4 lg:pl-0 lg:pr-6 xl:pr-8',
        '25/75': 'flex flex-col w-full lg:w-[75%] px-4 lg:pl-0 lg:pr-6 xl:pr-8'
    }
};

export default function TwoColLayout(props) {
    const { block } = props;
    const { childBlocks, properties } = block;
    const {
        layout_configuration = '50/50',
        max_width = 'regular',
        vertical_padding = 'lg',
        column_padding = 'lg',
        vertical_alignment = 'center'
    } = properties || {};

    if (!childBlocks.length) return null;

    const ChildBlocks = block.getChildBlockRenderer();

    return (
        <Container
            className={twJoin(
                'mx-auto flex flex-col lg:flex-row',
                max_width === 'regular' ? 'max-w-7xl' : '',
                max_width === 'wide' ? 'max-w-9xl' : '',
                max_width === 'full' ? 'max-w-full' : '',
                column_padding === 'none' ? 'gap-x-0' : '',
                column_padding === 'sm' ? 'lg:gap-x-2 2xl:gap-x-4' : '',
                column_padding === 'md' ? 'lg:gap-x-4 2xl:gap-x-8' : '',
                column_padding === 'lg' ? 'lg:gap-x-8 2xl:gap-x-12' : ''
            )}
            py={
                vertical_padding === 'none'
                    ? 'py-0 gap-y-2'
                    : vertical_padding === 'sm'
                    ? 'py-4 lg:py-6 gap-y-4'
                    : vertical_padding === 'lg'
                    ? 'py-12 lg:py-24 gap-y-8'
                    : ''
            }>
            {childBlocks.length === 1 ? (
                <div className='w-full'>
                    <ChildBlocks
                        block={block}
                        childBlocks={childBlocks}
                        extra={{ as: 'div', noPadding: true }}></ChildBlocks>
                </div>
            ) : (
                childBlocks.map((child, index) => (
                    <div
                        key={index}
                        className={twJoin(
                            index % 2 === 0 ? layouts.left[layout_configuration] : layouts.right[layout_configuration],
                            vertical_alignment === 'top' ? 'justify-start' : '',
                            vertical_alignment === 'bottom' ? 'justify-end' : '',
                            vertical_alignment === 'center' ? 'justify-center' : ''
                        )}>
                        <ChildBlocks
                            block={block}
                            childBlocks={[child]}
                            extra={{ as: 'div', noPadding: true }}></ChildBlocks>
                    </div>
                ))
            )}
        </Container>
    );
}
