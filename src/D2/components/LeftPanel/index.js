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
        <div className="relative">
            <div className="md:ml-auto h-[calc(100vh-64px)] w-full md:w-64 overflow-y-auto overflow-x-hidden py-6 md:py-8 pr-8 pl-1">
                <nav className="text-base md:text-sm lg:text-base xl:text-base">
                    <Navigation navigation={pages} activeRoute={activeRoute} />
                </nav>
            </div>
        </div>
    );
}

const Navigation = ({ navigation, activeRoute, level = 0 }) => {
    const isActive = (page) => page.route === activeRoute;

    const isRoot = level === 0;

    const containerClass = [
        level === 0
            ? 'space-y-9'
            : 'mt-2 space-y-2 border-l-2 border-slate-100 lg:mt-4 lg:space-y-4 lg:border-slate-200 dark:border-slate-700',
        level > 1 && 'ml-3.5',
        level === 2 && 'border-dashed',
        level === 3 && 'border-dotted',
        level > 3 && 'border-double',
    ].filter(Boolean);

    return (
        <ul role="list" className={twJoin(containerClass)}>
            {navigation.map((page) => {
                const baseLinkClass = isRoot
                    ? isActive(page)
                        ? 'font-semibold text-sky-500 before:bg-sky-500'
                        : 'font-medium text-slate-900 hover:text-slate-700 dark:text-white dark:hover:text-slate-200'
                    : 'block w-full pl-3.5 before:pointer-events-none before:absolute before:-left-1 before:top-[0.5em] before:h-1.5 before:w-1.5 before:rounded-full';

                const stateLinkClass = !isRoot
                    ? isActive(page)
                        ? 'font-semibold text-sky-500 before:bg-sky-500'
                        : 'text-slate-500 before:hidden before:bg-slate-400 hover:text-slate-600 hover:before:block dark:text-slate-400 dark:before:bg-slate-500 dark:hover:text-slate-300'
                    : '';

                return (
                    <li key={page.id} className={twJoin(!isRoot && 'relative')}>
                        {page.hasData ? (
                            <Link to={page.route} className={twJoin(baseLinkClass, stateLinkClass)}>
                                {page.label}
                            </Link>
                        ) : (
                            <div
                                className={twJoin(
                                    'font-medium',
                                    isRoot
                                        ? 'text-slate-900 dark:text-white'
                                        : 'pl-3.5 text-slate-600 dark:text-slate-400'
                                )}
                            >
                                {page.label}
                            </div>
                        )}
                        {page.child_items?.length ? (
                            <Navigation
                                navigation={page.child_items}
                                activeRoute={activeRoute}
                                level={level + 1}
                            />
                        ) : null}
                    </li>
                );
            })}
        </ul>
    );
};
