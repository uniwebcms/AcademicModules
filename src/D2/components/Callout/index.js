import React from 'react';
import { twJoin, SafeHtml } from '@uniwebcms/module-sdk';
import { LuInfo } from 'react-icons/lu';
import { IoWarningOutline } from 'react-icons/io5';

const styles = {
    info: {
        container: 'bg-sky-50 dark:bg-slate-800/60 dark:ring-1 dark:ring-slate-300/10',
        title: 'text-sky-900 dark:text-sky-400',
        body: 'text-sky-800 [--tw-prose-background:theme(colors.sky.50)] prose-a:text-sky-900 prose-code:text-sky-900 dark:text-slate-300 dark:prose-code:text-slate-300',
    },
    warning: {
        container: 'bg-amber-50 dark:bg-slate-800/60 dark:ring-1 dark:ring-slate-300/10',
        title: 'text-amber-900 dark:text-amber-500',
        body: 'text-amber-800 [--tw-prose-underline:theme(colors.amber.400)] [--tw-prose-background:theme(colors.amber.50)] prose-a:text-amber-900 prose-code:text-amber-900 dark:text-slate-300 dark:[--tw-prose-underline:theme(colors.sky.700)] dark:prose-code:text-slate-300',
    },
};

export default function Callout(props) {
    const { block } = props;

    const { title, paragraphs } = block.getBlockContent();
    const { type = 'info' } = block.getBlockProperties();

    return (
        <div className={twJoin('my-8 flex rounded-3xl p-6', styles[type].container)}>
            {type === 'info' ? (
                <LuInfo className="h-7 w-7 flex-none text-sky-600" />
            ) : (
                <IoWarningOutline className="h-7 w-7 flex-none text-amber-600" />
            )}
            <div className="ml-4 flex-auto">
                <p className={twJoin('m-0 font-display text-xl', styles[type].title)}>{title}</p>
                <div className={twJoin('prose mt-2.5', styles[type].body)}>
                    <SafeHtml value={paragraphs} />
                </div>
            </div>
        </div>
    );
}
