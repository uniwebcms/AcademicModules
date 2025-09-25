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
                // className={twJoin('mx-auto w-full prose prose-sm', styles.SectionWrapper)}
                className={twJoin(
                    'mt-8 prose prose-gray max-w-4xl max-auto w-full',
                    // headings
                    'prose-headings:font-normal',
                    // lead
                    'prose-lead:text-gray-500 prose-lead:mt-0',
                    // links
                    'prose-a:font-semibold',
                    // link underline
                    'prose-a:no-underline prose-a:shadow-[inset_0_-2px_0_0_var(--tw-prose-background,#fff),inset_0_calc(-1*(var(--tw-prose-underline-size,4px)+2px))_0_0_var(--tw-prose-underline,theme(colors.sky.300))] hover:prose-a:[--tw-prose-underline-size:6px]',
                    // pre
                    'prose-pre:rounded-xl prose-pre:bg-gray-700 prose-pre:shadow-lg prose-pre:px-[16px] prose-pre:py-[12px] prose-pre:text-base'
                )}
            >
                <Render {...props} content={parsedContent}></Render>
            </div>
        </div>
    );
}
