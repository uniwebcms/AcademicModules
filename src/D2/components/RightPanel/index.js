import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { stripTags, twJoin } from '@uniwebcms/module-sdk';

function normalizeId(string) {
    return stripTags(string).replace(/\s/g, '-').toLowerCase();
}

const getPageContent = (page) => {
    // get body's all "Section" block
    const sections =
        page.blockGroups.body?.filter((block) => block.widget?.widgetName === 'Section') || [];

    // get flat array of "Section" blocks info
    return sections
        .map((section) => {
            const result = [];
            let currentParent = null;

            section.content?.content
                ?.filter((part) => part.type === 'heading' && part.attrs?.level > 1)
                ?.forEach((header) => {
                    if (header) {
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

    let getHeadings = useCallback((pageContent) => {
        return pageContent
            .flatMap((node) => [node.id, ...node.children.map((child) => child.id)])
            .map((id) => {
                let el = document.getElementById(id);
                if (!el) return null;

                let style = window.getComputedStyle(el);
                let scrollMt = parseFloat(style.scrollMarginTop);

                let top = window.scrollY + el.getBoundingClientRect().top - scrollMt - offset;
                return { id, top };
            })
            .filter((x) => x !== null);
    }, []);

    useEffect(() => {
        if (pageContent.length === 0) return;
        let headings = getHeadings(pageContent);
        function onScroll() {
            let top = window.scrollY;
            let current = headings[0]?.id;
            for (let heading of headings) {
                if (top >= heading.top - 10) {
                    current = heading.id;
                } else {
                    break;
                }
            }
            setActiveId(current);
        }
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        return () => {
            window.removeEventListener('scroll', onScroll);
        };
    }, [getHeadings, pageContent]);

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
                        fr: 'Sur cette page',
                    })}
                </h2>
                <nav className="text-sm">
                    <ul role="list" className="mt-4 space-y-4">
                        {pageContent.map((content) => (
                            <li key={content.id}>
                                <button
                                    className={twJoin(
                                        'text-left',
                                        isActive(content)
                                            ? 'text-sky-500 font-semibold'
                                            : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 hover:font-semibold'
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
                                                            ? 'text-sky-500 font-semibold'
                                                            : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 hover:font-semibold'
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
