import React from 'react';
import Container from '../_utils/Container';
import { twJoin } from '@uniwebcms/module-sdk';
import './style.css';

const layouts = {
    left: {
        '50/50': 'flex flex-col w-full lg:w-1/2',
        '40/60': 'flex flex-col w-full lg:w-[40%]',
        '60/40': 'flex flex-col w-full lg:w-[60%]',
        '70/30': 'flex flex-col w-full lg:w-[70%]',
        '30/70': 'flex flex-col w-full lg:w-[30%]',
        '75/25': 'flex flex-col w-full lg:w-[75%]',
        '25/75': 'flex flex-col w-full lg:w-[25%]',
    },
    right: {
        '50/50': 'flex flex-col w-full lg:w-1/2',
        '40/60': 'flex flex-col w-full lg:w-[60%]',
        '60/40': 'flex flex-col w-full lg:w-[40%]',
        '70/30': 'flex flex-col w-full lg:w-[30%]',
        '30/70': 'flex flex-col w-full lg:w-[70%]',
        '75/25': 'flex flex-col w-full lg:w-[25%]',
        '25/75': 'flex flex-col w-full lg:w-[75%]',
    },
};

export default function TwoColLayout(props) {
    const { block } = props;
    const { childBlocks, properties } = block;
    const {
        layout_configuration = '50/50',
        max_width = 'regular',
        vertical_padding = 'lg',
        horizontal_padding = 'lg',
        column_padding = 'lg',
        vertical_alignment = 'center',
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
            }
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
                            index % 2 === 0
                                ? layouts.left[layout_configuration]
                                : layouts.right[layout_configuration],
                            horizontal_padding === 'none' ? 'px-0' : '',
                            horizontal_padding === 'sm' && index % 2 === 0
                                ? 'px-4 lg:pr-0 lg:pl-6'
                                : '',
                            horizontal_padding === 'sm' && index % 2 === 1
                                ? 'px-4 lg:pl-0 lg:pr-6'
                                : '',
                            horizontal_padding === 'lg' && index % 2 === 0
                                ? 'px-6 lg:pr-0 lg:pl-8'
                                : '',
                            horizontal_padding === 'lg' && index % 2 === 1
                                ? 'px-6 lg:pl-0 lg:pr-8'
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
