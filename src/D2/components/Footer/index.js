import React from 'react';
import { Link, twJoin, website } from '@uniwebcms/module-sdk';
import { LuArrowRight } from 'react-icons/lu';

function PageLink({ label, route, dir = 'next', id, className }) {
    return (
        <div id={id} className={className}>
            <dt className="font-display text-sm font-medium text-slate-900 dark:text-white">
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
                        'flex items-center gap-x-1 text-base font-semibold text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300',
                        dir === 'previous' && 'flex-row-reverse'
                    )}
                >
                    {label}
                    <LuArrowRight
                        className={twJoin(
                            'h-4 w-4 flex-none fill-current',
                            dir === 'previous' && '-scale-x-100'
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

    console.log('hierarchy', hierarchy);

    return (
        <dl className="mt-12 flex border-t border-slate-200 pt-6 dark:border-slate-800">
            {index > 0 && <PageLink dir="previous" {...hierarchy[index - 1]} />}
            {hierarchy[index + 1] !== undefined && (
                <PageLink className="ml-auto text-right" {...hierarchy[index + 1]} />
            )}
        </dl>
    );
}
