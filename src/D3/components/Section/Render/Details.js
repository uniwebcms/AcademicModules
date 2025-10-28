import React, { useState } from 'react';
import Render from './index';
import { HiPlus, HiMinus } from 'react-icons/hi';

export default function Details(props) {
    const { content, attrs } = props;

    const [open, setOpen] = useState(attrs.open || false);

    const title = content.find((c) => c.type === 'detailsSummary')?.content || '';
    const description = content.find((c) => c.type === 'detailsContent')?.content || [];

    return (
        <div className="my-[2em] border-[length:var(--depth-style-outline)] rounded-[var(--border-radius)] [box-shadow:var(--depth-style-shadow)] border-text-color/20 bg-[var(--card-background-color)] p-4 lg:p-6">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between gap-2 bg-transparent focus:outline-none group"
            >
                <h3 className="!my-0 text-lg font-medium truncate text-heading-color" title={title}>
                    {title}
                </h3>
                {open ? (
                    <HiMinus className="w-6 h-6 text-text-color/70 group-hover:text-text-color" />
                ) : (
                    <HiPlus className="w-6 h-6 text-text-color/70 group-hover:text-text-color" />
                )}
            </button>
            {open && (
                <div>
                    <Render content={description} />
                </div>
            )}
        </div>
    );
}
