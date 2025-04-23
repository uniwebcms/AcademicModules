import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, stripTags, twJoin } from '@uniwebcms/module-sdk';

function normalizeId(string) {
    return stripTags(string).replace(/\s/g, '-').toLowerCase();
}

const getPageContent = (page) => {
    // get body's all "Section" block
    const sections =
        page.blockGroups.body?.filter((element) => element.Component.name === 'Section') || [];

    // get flat array of "Section" blocks info
    return sections
        .map((section) => {
            const result = [];
            let currentParent = null;

            section.content?.content
                ?.filter((part) => part.type === 'heading' && part.attrs?.level > 1)
                .forEach((header) => {
                    const text = header.content.map((obj) => obj.text).join('');
                    if (header.attrs.level === 2) {
                        currentParent = {
                            id: `Section${section.id}-${normalizeId(text)}`,
                            level: 2,
                            title: text,
                            children: [],
                        };
                        result.push(currentParent);
                    } else if (header.attrs.level === 3 && currentParent) {
                        currentParent.children.push({
                            id: `Section${section.id}-${normalizeId(text)}`,
                            level: 3,
                            title: text,
                        });
                    }
                });

            return result;
        })
        .flat();
};

export default function RightPanel(props) {
    const offset = 90;
    const { page, website } = props;
    const [activeId, setActiveId] = useState('');
    const pageContent = useMemo(() => getPageContent(page), [page]);

    const scrollTo = useCallback(
        (id) => {
            const el = document.getElementById(id);
            if (!el) return;
            const y = el.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        },
        [offset]
    );

    // const handleScroll = useCallback(() => {
    //     const scrollPosition = window.pageYOffset + offset + 1;
    //     let current = '';
    //     const flatContent = pageContent.flatMap((node) => [
    //         node.id,
    //         ...node.children.map((child) => child.id),
    //     ]);

    //     for (const content of flatContent) {
    //         const el = document.getElementById(content);
    //         if (el && scrollPosition >= el.offsetTop) {
    //             current = content;
    //         }
    //     }
    //     setActiveId(current);
    // }, [pageContent, offset]);

    // useEffect(() => {
    //     window.addEventListener('scroll', handleScroll, { passive: true });
    //     handleScroll();

    //     return () => {
    //         window.removeEventListener('scroll', handleScroll);
    //     };
    // }, [handleScroll]);

    const isActive = (content) => content.id === activeId;

    if (!pageContent.length) return null;

    return (
        <div className="relative hidden xl:block">
            <div className="h-[calc(100vh-64px)] w-64 overflow-y-auto overflow-x-hidden py-8 pl-8 pr-1">
                <h2 className="text-xs font-medium uppercase tracking-wide text-slate-900 dark:text-white">
                    {website.localize({
                        en: 'On this page',
                        es: 'En esta página',
                    })}
                </h2>
                <nav className="text-sm font-medium text-slate-500 hover:text-slate-700">
                    <ul role="list" className="mt-4 space-y-4">
                        {pageContent.map((content) => (
                            <li key={content.id}>
                                <button
                                    className={twJoin(
                                        isActive(content)
                                            ? 'text-sky-500'
                                            : ' dark:text-slate-400 dark:hover:text-slate-300'
                                    )}
                                    onClick={() => {
                                        scrollTo(content.id);
                                    }}
                                >
                                    {content.title}
                                </button>
                                {content.children?.length ? (
                                    <ul role="list" className="mt-3 space-y-4 pl-5">
                                        {content.children.map((subContent) => (
                                            <li key={subContent.id}>
                                                <button
                                                    className={
                                                        isActive(subContent)
                                                            ? 'text-sky-500'
                                                            : ' dark:text-slate-400 dark:hover:text-slate-300'
                                                    }
                                                    onClick={() => {
                                                        scrollTo(subContent.id);
                                                    }}
                                                >
                                                    {subContent.title}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                ) : null}
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </div>
    );
}
