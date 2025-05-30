import React from 'react';
import { twJoin, website } from '@uniwebcms/module-sdk';
import { Link } from '@uniwebcms/core-components';
import { LuArrowRight } from 'react-icons/lu';

function PageLink({ label, route, dir = 'next', id, className }) {
    return (
        <div id={id} className={className}>
            <dt className="font-display text-sm font-medium text-slate-500 dark:text-slate-500 uppercase">
                {dir === 'next'
                    ? website.localize({
                          en: 'Next',
                          fr: 'Suivant',
                      })
                    : website.localize({
                          en: 'Previous',
                          fr: 'Précédent',
                      })}
            </dt>
            <dd className="mt-1">
                <Link
                    href={route}
                    className={twJoin(
                        'group flex items-center gap-x-1 text-base text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-slate-100',
                        dir === 'previous' && 'flex-row-reverse'
                    )}
                >
                    {label}
                    <LuArrowRight
                        className={twJoin(
                            'h-4 w-4 flex-none fill-current transition-transform duration-200 ease-out',
                            dir === 'previous'
                                ? '-scale-x-100 group-hover:-translate-x-1'
                                : 'group-hover:translate-x-1'
                        )}
                    />
                </Link>
            </dd>
        </div>
    );
}

export default function footer(props) {
    const { page, website } = props;

    const id = page.getPageId();
    const hierarchy = website.getPageHierarchy({
        nested: false,
        pageOnly: true,
    });

    const index = hierarchy.findIndex((page) => page.id === id);
    if (index === 0 && hierarchy.length === 1) {
        return null;
    }

    return (
        <dl className="mt-12 flex border-t border-slate-200 pt-6 dark:border-slate-800">
            {index > 0 && <PageLink dir="previous" {...hierarchy[index - 1]} />}
            {hierarchy[index + 1] !== undefined && (
                <PageLink className="ml-auto text-right" {...hierarchy[index + 1]} />
            )}
        </dl>
    );
}
