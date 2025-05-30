import React from 'react';
import Container from '../_utils/Container';
import { twJoin } from '@uniwebcms/module-sdk';
import { SafeHtml } from '@uniwebcms/core-components';

export default function Timeline(props) {
    const { block } = props;

    const { title, subtitle, lists } = block.getBlockContent();
    const items = block.getBlockItems();

    const endnotes = lists[0]?.map((item) => item.paragraphs[0])?.filter(Boolean) || [];

    const endnoteStyle = [
        'text-2xl italic font-light text-[var(--callout)]',
        'text-lg font-medium text-[var(--muted)]',
    ];

    return (
        <Container py="lg" px="sm">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-4xl font-bold mb-6 text-center text-heading-color">{title}</h2>
                <p className="text-xl mb-16 text-center text-heading-color/70">{subtitle}</p>
                <div className="relative">
                    <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-900 via-primary-400 to-primary-900"></div>
                    <div className="flex flex-col space-y-12 md:space-y-0">
                        {items.map((item, index) => {
                            const { title, paragraphs } = item;
                            return (
                                <div
                                    key={index}
                                    className={twJoin(
                                        'flex flex-col md:flex-row items-center md:gap-8',
                                        index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'
                                    )}
                                >
                                    <div
                                        className={twJoin(
                                            'w-full md:w-1/2',
                                            index % 2 === 1 ? 'md:text-left' : 'md:text-right'
                                        )}
                                    >
                                        <div className="bg-bg-color-80 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-bg-color-60">
                                            <h3 className="text-xl font-medium mb-3 text-text-color">
                                                {title}
                                            </h3>
                                            <p className="text-text-color/80">{paragraphs}</p>
                                        </div>
                                    </div>
                                    <div className="hidden md:flex min-w-12 min-h-12 z-10 rounded-full bg-gradient-to-r from-primary-700 to-primary-300 items-center justify-center shadow-lg">
                                        <span className="text-lg font-medium text-primary-100">
                                            {index + 1}
                                        </span>
                                    </div>
                                    <div className="hidden md:block w-full md:w-1/2"></div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                {endnotes.length > 0 && (
                    <div className="mt-16 md:mt-4 relative">
                        <div className="relative pt-6 px-6 space-y-4">
                            {endnotes.map((endnote, index) => (
                                <SafeHtml
                                    value={endnote}
                                    key={index}
                                    className={twJoin('text-center', endnoteStyle[index % 2])}
                                ></SafeHtml>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </Container>
    );
}
