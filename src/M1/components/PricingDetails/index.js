import React from 'react';
import Fancy from './Fancy';

export default function PricingDetails(props) {
    const { block } = props;

    const { title, subtitle } = block.getBlockContent();

    const items = block.getBlockItems();

    return <Fancy {...{ title, subtitle, items }} />;
}
