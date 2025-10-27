import React from 'react';
import { Icon, SafeHtml, Link } from '@uniwebcms/core-components';

function QuickLink(props) {
    const { title, paragraphs, icons, links } = props;

    const icon = icons[0];
    const link = links[0];

    const Element = link ? Link : 'div';
    const elementProps = link ? { to: link.href } : {};

    return (
        <div className="group relative rounded-[var(--border-radius)] border border-[var(--border-color)] dark:bg-slate-800/60">
            <div className="absolute -inset-px rounded-[var(--border-radius)] border-2 border-transparent opacity-0 [background:linear-gradient(var(--quick-links-hover-bg,theme(colors.sky.50)),var(--quick-links-hover-bg,theme(colors.sky.50)))_padding-box,linear-gradient(to_top,theme(colors.indigo.400),theme(colors.cyan.400),theme(colors.sky.500))_border-box] group-hover:opacity-100 dark:[--quick-links-hover-bg:theme(colors.slate.800)]" />
            <div className="relative overflow-hidden rounded-xl p-6">
                {icon ? (
                    <Icon icon={icon} className="h-8 w-8 text-sky-600" />
                ) : (
                    <div className="h-8 w-8" />
                )}
                <h2 className="mt-4 font-display text-base md:text-lg text-slate-900 dark:text-white">
                    <Element {...elementProps}>
                        <span className="absolute -inset-px rounded-xl" />
                        {title}
                    </Element>
                </h2>
                <SafeHtml
                    value={paragraphs}
                    className="mt-2 text-sm md:text-base text-slate-700 dark:text-slate-300"
                />
            </div>
        </div>
    );
}

export default function QuickLinks(props) {
    const { block } = props;

    const items = block.getBlockItems();

    if (!items.length) {
        return null;
    }

    return (
        <div className="not-prose my-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {items.map((item, index) => (
                <QuickLink key={index} {...item} />
            ))}
        </div>
    );
}
