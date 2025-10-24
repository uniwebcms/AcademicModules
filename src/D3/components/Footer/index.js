import React from 'react';
import { twJoin, website } from '@uniwebcms/module-sdk';
import { Link } from '@uniwebcms/core-components';
import { LuArrowRight } from 'react-icons/lu';

function PageLink({ label, route, dir = 'next', id, depthStyle, cornerStyle }) {
    const arrow = (
        <LuArrowRight
            className={twJoin(
                'h-4 w-4 flex-shrink-0 text-link-color group-hover:text-link-hover-color transition-transform duration-200 ease-out',
                dir === 'previous'
                    ? '-scale-x-100 group-hover:-translate-x-1'
                    : 'group-hover:translate-x-1'
            )}
        />
    );

    const wrapperClass = ['cursor-pointer group w-full'];

    if (depthStyle === 'drop_shadow') {
        wrapperClass.push('p-2.5 shadow-md hover:shadow-lg');
    }
    if (depthStyle === 'outline') {
        wrapperClass.push('p-2.5 border border-text-color/20');
    }

    if (cornerStyle === 'rounded') {
        wrapperClass.push('rounded-lg');
    }

    return (
        <Link to={route} className={twJoin(wrapperClass)}>
            <p
                className={twJoin(
                    'block text-sm font-medium text-text-color/70 uppercase',
                    dir === 'previous' ? 'text-left' : 'text-right'
                )}
            >
                {dir === 'next'
                    ? website.localize({
                          en: 'Next',
                          fr: 'Suivant',
                      })
                    : website.localize({
                          en: 'Previous',
                          fr: 'Précédent',
                      })}
            </p>
            <div className="mt-1">
                <span
                    className={twJoin(
                        'flex items-center gap-x-1 text-base',
                        dir === 'previous' ? 'justify-start' : 'justify-end'
                    )}
                >
                    {dir === 'previous' ? arrow : null}
                    {label}
                    {dir === 'next' ? arrow : null}
                </span>
            </div>
        </Link>
    );
}

export default function footer(props) {
    const { page, website, block } = props;

    const id = page.getPageId();
    const hierarchy = website.getPageHierarchy({
        nested: false,
        pageOnly: true,
    });

    const index = hierarchy.findIndex((page) => page.id === id);

    if (index === 0 && hierarchy.length === 1) {
        return null;
    }

    const {
        with_line_divider = true,
        depth_style = 'flat',
        corner_style = 'square',
    } = block.getBlockProperties();

    return (
        <dl
            className={twJoin(
                'mt-12 pt-6 w-full flex flex-col sm:flex-row gap-4',
                with_line_divider && 'border-t border-text-color/20'
            )}
        >
            {index > 0 && (
                <PageLink
                    dir="previous"
                    depthStyle={depth_style}
                    cornerStyle={corner_style}
                    {...hierarchy[index - 1]}
                />
            )}
            {hierarchy[index + 1] !== undefined && (
                <PageLink
                    dir="next"
                    depthStyle={depth_style}
                    cornerStyle={corner_style}
                    {...hierarchy[index + 1]}
                />
            )}
        </dl>
    );
}
