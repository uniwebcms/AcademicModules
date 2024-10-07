import React from 'react';
import { twJoin } from '@uniwebcms/module-sdk';
import Render from '../_utils/articles/Render';

export default function Section(props) {
    const { block, extra } = props;

    const Tag = extra?.as || 'section';
    const noPadding = extra?.noPadding || false;

    const properties = block.getBlockProperties();

    const verticalPadding = properties.vertical_padding || 'lg';

    return (
        <Tag
            className={twJoin(
                verticalPadding === 'lg' ? 'py-12 lg:py-24' : '',
                verticalPadding === 'md' ? 'py-6 lg:py-12' : '',
                verticalPadding === 'sm' ? 'py-3 lg:py-6' : '',
                noPadding ? 'py-0 lg:py-0' : ''
            )}
        >
            <Render {...props} />
        </Tag>
    );
}
