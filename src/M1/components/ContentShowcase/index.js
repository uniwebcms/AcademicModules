import React from 'react';
import Fancy from './Fancy';

export default function ContentShowcase(props) {
    const { block } = props;
    const { title, subtitle } = block.getBlockContent();

    const items = block.getBlockItems();

    const { appearance = 'fancy' } = block.getBlockProperties();

    if (appearance === 'fancy') {
        return <Fancy {...{ title, subtitle, items }} />;
    }
}
