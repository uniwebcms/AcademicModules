import React from 'react';
import { twJoin } from '@uniwebcms/module-sdk';
import { Link } from '@uniwebcms/core-components';

export default function LeftPanel(props) {
    const {
        website,
        page: { activeRoute },
    } = props;
    const pages = website.getPageHierarchy();

    return (
        <div className="relative hidden lg:block">
            <div className="ml-auto h-[calc(100vh-64px)] w-64 overflow-y-auto overflow-x-hidden py-8 pr-8 pl-1">
                <nav className="text-sm xl:text-base">
                    <ul role="list" className="space-y-9">
                        {pages.map((section) => (
                            <li key={section.id}>
                                {section.hasData ? (
                                    <Link
                                        to={section.route}
                                        className={twJoin(
                                            'font-display',
                                            section.route === activeRoute
                                                ? 'font-semibold text-sky-500 before:bg-sky-500'
                                                : 'font-medium text-slate-900 hover:text-slate-700 dark:text-white dark:hover:text-slate-200'
                                        )}
                                    >
                                        {section.label}
                                    </Link>
                                ) : (
                                    <h2 className="font-display font-medium text-slate-900 dark:text-white">
                                        {section.label}
                                    </h2>
                                )}
                                <ul
                                    role="list"
                                    className="mt-2 space-y-2 border-l-2 border-slate-100 lg:mt-4 lg:space-y-4 lg:border-slate-200 dark:border-slate-700"
                                >
                                    {section.child_items.map((link) => (
                                        <li key={link.id} className="relative">
                                            <Link
                                                to={link.route}
                                                className={twJoin(
                                                    'block w-full pl-3.5 before:pointer-events-none before:absolute before:-left-1 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full',
                                                    link.route === activeRoute
                                                        ? 'font-semibold text-sky-500 before:bg-sky-500'
                                                        : 'text-slate-500 before:hidden before:bg-slate-300 hover:text-slate-600 hover:before:block dark:text-slate-400 dark:before:bg-slate-700 dark:hover:text-slate-300'
                                                )}
                                            >
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </div>
    );
}
