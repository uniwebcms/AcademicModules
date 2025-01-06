import React from 'react';
import Fancy from './Fancy';

export default function PricingFeatures(props) {
    const { block } = props;
    const { title, subtitle } = block.getBlockContent();

    const items = block.getBlockItems();

    const { appearance = 'fancy', layout_style = 'grid' } = block.getBlockProperties();

    return <Fancy {...{ title, subtitle, items, layout: layout_style }} />;
}
