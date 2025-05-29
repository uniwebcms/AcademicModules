import React, { useState } from 'react';
import { twJoin, SafeHtml } from '@uniwebcms/module-sdk';
import { HiChevronDown } from 'react-icons/hi';

export default function FAQ(props) {
    const { block } = props;

    const { title } = block.getBlockContent();
    const items = block.getBlockItems();

    const [openState, setOpenState] = useState(
        items.reduce((acc, _, index) => {
            acc[index] = index === 0; // Open the first item by default
            return acc;
        }, {})
    );

    return (
        <div className="py-[60px] px-5">
            <div className="text-center">
                <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl">{title}</h2>
            </div>
            <div className="relative mt-12 max-w-[1000px] mx-auto space-y-8">
                {items.map((item, index) => {
                    const { title, paragraphs } = item;

                    const isOpen = openState[index] || false;

                    return (
                        <button
                            key={index}
                            className="w-full rounded-xl p-6 shadow-lg shadow-neutral-300 border border-neutral-100"
                            onClick={() =>
                                setOpenState((prev) => {
                                    const newState = { ...prev };
                                    newState[index] = !newState[index];
                                    return newState;
                                })
                            }
                        >
                            <div className="flex flex-col text-left">
                                <div className="flex items-center justify-between gap-3">
                                    <h3 className="text-xl text-pretty">{title}</h3>
                                    <HiChevronDown
                                        className={twJoin(
                                            'h-6 w-6 transform transition-transform duration-300 text-neutral-400 flex-shrink-0',
                                            isOpen ? 'rotate-180' : ''
                                        )}
                                    />
                                </div>
                                <div
                                    className={twJoin(
                                        'prose max-w-none overflow-hidden transition-all duration-300 text-text-color prose-a:text-blue-600',
                                        isOpen ? 'max-h-[800px]' : 'max-h-0'
                                    )}
                                >
                                    <SafeHtml value={paragraphs} />
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
