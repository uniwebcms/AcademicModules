import React from 'react';
import Fancy from './Fancy';

export default function PricingDetails(props) {
    const { block } = props;

    const { title, subtitle } = block.getBlockContent();

    const items = block.getBlockItems();

    const { appearance = 'fancy', appearance_preset = 'none' } = block.getBlockProperties();

    return <Fancy {...{ title, subtitle, items, uiPreset: appearance_preset }} />;
}