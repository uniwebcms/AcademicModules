import React from 'react';
import Fancy from './Fancy';

export default function PricingAddons(props) {
    const { block } = props;

    const { title, subtitle, lists } = block.getBlockContent();

    const promotions = lists[0]?.map((item) => {
        return {
            title: item.paragraphs?.[0],
            description: item.lists?.[0]?.[0]?.paragraphs?.[0],
        };
    });

    const items = block.getBlockItems();

    const { appearance = 'fancy' } = block.getBlockProperties();

    return <Fancy {...{ title, subtitle, promotions, items }} />;
}
