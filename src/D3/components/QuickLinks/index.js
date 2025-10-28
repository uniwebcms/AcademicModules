import React from 'react';
import { Icon, SafeHtml, Link } from '@uniwebcms/core-components';
import { LuExternalLink } from 'react-icons/lu';
import { twJoin } from '@uniwebcms/module-sdk';

function QuickLink(props) {
    const { title, paragraphs, icons, links } = props;

    const icon = icons[0];
    const link = links[0];

    return (
        <div className="group relative border-[length:var(--depth-style-outline)] rounded-[var(--border-radius)] [box-shadow:var(--depth-style-shadow)] border-text-color/20 bg-[var(--card-background-color)]">
            <div className="relative overflow-hidden rounded-xl p-6">
                {icon ? <Icon icon={icon} className="h-8 w-8" /> : <div className="h-8 w-8" />}
                <h2 className={'mt-4 text-lg lg:text-xl font-semibold'}>{title}</h2>
                <SafeHtml value={paragraphs} className="mt-2 text-sm md:text-base" />
            </div>
            {link ? (
                <Link to={link.href} className="absolute top-6 right-6">
                    <LuExternalLink className="w-6 h-6 text-link-color/40 group-hover:text-link-color hover:!text-link-hover-color" />
                </Link>
            ) : null}
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
