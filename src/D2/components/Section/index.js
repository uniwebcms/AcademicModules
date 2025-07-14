import React from 'react';
import { twJoin } from '@uniwebcms/module-sdk';
import Render from './Render';
import { buildArticleBlocks } from './parser';
import styles from './Section.module.scss';

export default function Section(props) {
    const { website, block } = props;
    const { content } = block;

    if (!content || !Object.keys(content).length) return null;

    const { paragraph_standout = false } = block.getBlockProperties();

    const parsedContent = buildArticleBlocks(website.parseLinksInArticle(content));

    // remove last empty paragraph
    if (
        parsedContent[parsedContent.length - 1]?.type === 'paragraph' &&
        parsedContent[parsedContent.length - 1]?.content === '<span>&nbsp;</span>'
    ) {
        parsedContent.pop();
    }

    return (
        <div className="max-w-full relative flex flex-col">
            <div className={twJoin('mx-auto w-full', styles.SectionWrapper)}>
                <Render {...props} content={parsedContent} settings={{ paragraph_standout }} />
            </div>
        </div>
    );
}
