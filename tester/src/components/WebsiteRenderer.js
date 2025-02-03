import React from 'react';
import PageRenderer from './PageRenderer';
import { buildThemeStyles } from '../utils/helper';
import { Style } from 'react-style-tag';
import Fonts from './Fonts';

export default function WebsiteRenderer(props) {
    const website = uniweb.activeWebsite;

    if (!website) {
        return null;
    }

    return (
        <>
            <Fonts fontsData={website.themeData.importedFonts}></Fonts>
            <Style hasSourceMap={false} name="color-themes">
                {buildThemeStyles(website.themeData)}
            </Style>
            <PageRenderer />
        </>
    );
}
