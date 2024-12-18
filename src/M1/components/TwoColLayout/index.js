import React from 'react';
import Container from '../_utils/Container';
import { twJoin } from '@uniwebcms/module-sdk';

const layouts = {
    left: {
        '50/50': 'flex flex-col w-full lg:w-1/2',
        '40/60': 'flex flex-col w-full lg:w-[40%]',
        '60/40': 'flex flex-col w-full lg:w-[60%]',
        '70/30': 'flex flex-col w-full lg:w-[70%]',
        '30/70': 'flex flex-col w-full lg:w-[30%]',
        '70/30': 'flex flex-col w-full lg:w-[70%]',
        '30/70': 'flex flex-col w-full lg:w-[30%]',
    },
    right: {
        '50/50': 'flex flex-col w-full lg:w-1/2',
        '40/60': 'flex flex-col w-full lg:w-[60%]',
        '60/40': 'flex flex-col w-full lg:w-[40%]',
        '70/30': 'flex flex-col w-full lg:w-[30%]',
        '30/70': 'flex flex-col w-full lg:w-[70%]',
        '70/30': 'flex flex-col w-full lg:w-[30%]',
        '30/70': 'flex flex-col w-full lg:w-[70%]',
    },
};

export default function TwoColLayout(props) {
    const { block } = props;
    const { childBlocks, properties } = block;
    const {
        layout_configuration = '50/50',
        max_width = 'narrow',
        vertical_padding = 'lg',
        horizontal_padding = 'lg',
        column_padding = 'lg',
        vertical_alignment = 'top',
    } = properties || {};

    if (!childBlocks.length) return null;

    const ChildBlocks = block.getChildBlockRenderer();

    return (
        <Container
            className={twJoin(
                'mx-auto flex flex-col lg:flex-row gap-y-8 lg:gap-y-0',
                max_width === 'narrow' ? 'max-w-6xl' : '',
                max_width === 'wide' ? 'max-w-8xl' : '',
                max_width === 'full' ? 'max-w-full' : '',
                column_padding === 'none' ? 'gap-x-0' : '',
                column_padding === 'sm' ? 'lg:gap-x-4 xl:gap-x-8' : '',
                column_padding === 'md' ? 'lg:gap-x-6 xl:gap-x-12' : '',
                column_padding === 'lg' ? 'lg:gap-x-12 xl:gap-x-28' : ''
            )}
            py={
                vertical_padding === 'none'
                    ? 'py-0 gap-y-2'
                    : vertical_padding === 'sm'
                    ? 'py-4 lg:py-6 gap-y-4'
                    : vertical_padding === 'lg'
                    ? 'py-6 md:py-12 lg:py-24 gap-y-8'
                    : ''
            }
            px={'px-4 md:px-6 lg:px-10 xl:px-12 2xl:px-16'}
        >
            {childBlocks.length === 1 ? (
                <div className="w-full">
                    <ChildBlocks
                        block={block}
                        childBlocks={childBlocks}
                        extra={{ as: 'div', noPadding: true }}
                    ></ChildBlocks>
                </div>
            ) : (
                childBlocks.map((child, index) => (
                    <div
                        key={index}
                        className={twJoin(
                            'h-full flex-grow',
                            index % 2 === 0
                                ? layouts.left[layout_configuration]
                                : layouts.right[layout_configuration],
                            horizontal_padding === 'none' ? 'px-0' : '',
                            horizontal_padding === 'sm' && index % 2 === 0
                                ? 'px-2 md:px-4 lg:pr-0 lg:pl-6'
                                : '',
                            horizontal_padding === 'sm' && index % 2 === 1
                                ? 'px-2 md:px-4 lg:pl-0 lg:pr-6'
                                : '',
                            horizontal_padding === 'lg' && index % 2 === 0
                                ? 'px-3 md:px-6 lg:pr-0 lg:pl-8'
                                : '',
                            horizontal_padding === 'lg' && index % 2 === 1
                                ? 'px-3 md:px-6 lg:pl-0 lg:pr-8'
                                : '',
                            vertical_alignment === 'top' ? 'justify-start' : '',
                            vertical_alignment === 'bottom' ? 'justify-end' : '',
                            vertical_alignment === 'center' ? 'justify-center' : ''
                        )}
                    >
                        <ChildBlocks
                            block={block}
                            childBlocks={[child]}
                            extra={{ as: 'div', noPadding: true }}
                        ></ChildBlocks>
                    </div>
                ))
            )}
        </Container>
    );
}
