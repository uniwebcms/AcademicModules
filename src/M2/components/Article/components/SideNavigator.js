import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { website } from '@uniwebcms/module-sdk';

function buildHeadingTree(headings) {
    const root = [];
    const stack = [];

    for (const heading of headings) {
        const level = parseInt(heading.tagName.substring(1), 10);
        const node = {
            id: heading.id,
            title: heading.textContent,
            level,
            children: [],
        };

        while (stack.length > 0 && stack[stack.length - 1].level >= level) {
            stack.pop();
        }

        if (stack.length === 0) {
            root.push(node);
        } else {
            stack[stack.length - 1].children.push(node);
        }

        stack.push(node);
    }

    return root;
}

function TocList({ items, level = 1 }) {
    const scrollTo = useCallback((id) => {
        const el = document.getElementById(id);
        if (!el) return;
        const y = el.getBoundingClientRect().top + window.pageYOffset - 100;
        window.scrollTo({ top: y, behavior: 'smooth' });
    }, []);

    return (
        <ul className="list-none p-0 m-0">
            {items.map((item) => (
                <li key={item.id} style={{ marginLeft: `${(level - 1) * 20}px` }}>
                    <div
                        className="cursor-pointer text-text-color hover:underline mb-1"
                        onClick={() => {
                            scrollTo(item.id);
                        }}
                    >
                        {item.title}
                    </div>
                    {item.children.length > 0 && (
                        <TocList items={item.children} level={level + 1} />
                    )}
                </li>
            ))}
        </ul>
    );
}

export default function SideNavigator({ articleRef }) {
    const [toc, setToc] = useState([]);

    useEffect(() => {
        if (!articleRef?.current) return;

        const article = articleRef.current.querySelector('article');
        if (!article) return;

        const headings = Array.from(article.querySelectorAll('h1, h2, h3')).filter((h) => h.id);

        const tocTree = buildHeadingTree(headings);
        setToc(tocTree);
    }, [articleRef]);

    return (
        <nav>
            <p className="text-text-color-80 mb-4 text-base xl:text-lg font-bold">
                {website.localize({
                    en: 'In this article',
                    fr: 'Dans cet article',
                    es: 'En este artículo',
                    zh: '在本文中',
                })}
            </p>
            <TocList items={toc} />
        </nav>
    );
}
