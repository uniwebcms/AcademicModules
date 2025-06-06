import React, { useMemo, useState, useEffect } from 'react';
import { website } from '@uniwebcms/module-sdk';
import { LuImage } from 'react-icons/lu';
import StylerViewer from './StylerViewer';

const ItemCard = React.memo(({ item, schema, getSchema }) => {
    let { title, description, image, category, url } = item;

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
            <div className="block px-3 py-2 relative flex-grow overflow-hidden h-[85px]">
                <p
                    className="text-base font-bold truncate group-hover:underline"
                    style={{
                        maxWidth: category ? 'calc(100% - 6rem)' : '100%',
                    }}
                    title={title}
                >
                    {title}
                </p>
                <p className="text-sm text-text-color/70 mt-1.5 line-clamp-2" title={description}>
                    {description}
                </p>
                {category && (
                    <span className="absolute top-2.5 right-2 px-2 py-0.5 rounded-full text-xs bg-accent-50 text-accent-500 truncate max-w-24">
                        {category}
                    </span>
                )}
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
            <div className="flex flex-col w-full h-full relative group rounded-lg overflow-hidden hover:shadow-md ring-1 ring-neutral-300">
                {/* Static Image & badge */}
                <div className="relative w-full aspect-square border-b border-neutral-300">
                    {image.src ? (
                        <img
                            src={image.src}
                            alt={image.alt}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="flex items-center justify-center w-full h-full bg-neutral-100">
                            <LuImage className="w-12 h-12 text-neutral-300" />
                        </div>
                    )}
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

                {/* Overlay for link click */}
                {schema && (
                    <div
                        onClick={() => {
                            setViewerOpen(true);
                        }}
                        className="absolute inset-0 z-[1]"
                    />
                )}
            </div>
            {viewerOpen && schema && (
                <div className="fixed inset-0 z-[100] bg-black/75 flex items-center justify-center">
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
