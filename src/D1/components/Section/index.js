import React from 'react';
import { twJoin } from '@uniwebcms/module-sdk';
import Render from './Renderer';
import styles from './Renderer/Section.module.scss';
import { buildArticleBlocks } from './Renderer/helper';

export default function Section(props) {
    const { block, website } = props;

    const { content } = block;

    if (!content || !Object.keys(content).length) return null;

    const parsedContent = buildArticleBlocks(website.parseLinksInArticle(content));

    return (
        <div className={twJoin('max-w-full relative flex flex-col')}>
            <div
                className={twJoin('mx-auto w-full', styles.SectionWrapper)}
                style={{
                    maxWidth: '896px',
                }}
            >
                <Render {...props} content={parsedContent}></Render>
            </div>
        </div>
    );
}
