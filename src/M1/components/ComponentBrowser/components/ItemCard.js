import React, { useMemo, useState, useEffect } from 'react';
import { website } from '@uniwebcms/module-sdk';
import { Image } from '@uniwebcms/core-components';
import StylerViewer from './StylerViewer';

const makeLabel = (key) => {
    return key
        .split('_')
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join(' ');
};

const ItemCard = React.memo(({ item, schema, getSchema }) => {
    let { title, description, category, url, profile } = item;

    const [viewerOpen, setViewerOpen] = useState(false);

    useEffect(() => {
        if (!schema && getSchema) getSchema(url);
    }, [url, schema, getSchema]);

    useEffect(() => {
        if (viewerOpen) {
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = `${scrollbarWidth}px`;
        } else {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        }

        return () => {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        };
    }, [viewerOpen]);

    // Memoize card content to prevent unnecessary re-renders
    const cardInfo = useMemo(() => {
        return (
            <div className="block px-3 py-2 relative flex-grow overflow-hidden h-[140px]">
                <p className="text-base font-bold truncate group-hover:underline" title={title}>
                    {title}
                </p>
                <p className="text-sm text-text-color/70 mt-1.5 line-clamp-3" title={description}>
                    {description}
                </p>
                <div className="mt-2 flex gap-2 overflow-auto">
                    {category.map((cat, index) => (
                        <span
                            key={index}
                            className="rounded-full text-xs bg-accent-100 text-accent-600 px-2 py-0.5"
                        >
                            {makeLabel(cat)}
                        </span>
                    ))}
                </div>
            </div>
        );
    }, [title, description, category]);

    const numberOfComponents = schema
        ? Object.keys(schema).filter((key) => key !== '_self').length
        : null;

    const displayedNumberOfComponents =
        numberOfComponents !== null && numberOfComponents > 0
            ? numberOfComponents < 10
                ? numberOfComponents
                : numberOfComponents % 10 === 0
                ? numberOfComponents
                : `${Math.floor(numberOfComponents / 10) * 10}+`
            : false;

    return (
        <>
            <div
                onClick={() => {
                    if (!schema) return;
                    setViewerOpen(true);
                }}
                className="flex flex-col w-full h-full relative group rounded-lg overflow-hidden hover:shadow-md ring-1 ring-neutral-300 cursor-pointer"
            >
                {/* Static Image & badge */}
                <div className="relative w-full aspect-square border-b border-neutral-300">
                    <Image profile={profile} type="banner" className="w-full h-full object-cover" />
                    {displayedNumberOfComponents && (
                        <div className="absolute top-4 right-4 bg-neutral-800 text-neutral-50 rounded-full text-xs px-2.5 py-1">
                            {displayedNumberOfComponents}{' '}
                            {website.localize({
                                en: 'components',
                                fr: 'composants',
                                es: 'componentes',
                                zh: '组件',
                            })}
                        </div>
                    )}
                </div>

                {/* Card Info */}
                {cardInfo}
            </div>
            {viewerOpen && schema && (
                <div className="fixed inset-0 z-[100] bg-black/85 flex items-center justify-center">
                    <StylerViewer
                        styler={item}
                        schema={schema}
                        onClose={() => setViewerOpen(false)}
                    />
                </div>
            )}
        </>
    );
});

export default ItemCard;
