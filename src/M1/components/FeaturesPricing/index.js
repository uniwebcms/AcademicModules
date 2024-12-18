import React from 'react';
import Container from '../_utils/Container';
import { SafeHtml, Icon, Link, twJoin } from '@uniwebcms/module-sdk';

export default function FeaturePricing(props) {
    const { block } = props;
    const { title, subtitle, lists } = block.getBlockContent();

    const items = block.getBlockItems();

    const { color_tone = 'none' } = block.getBlockProperties();

    let iconBgColor = '',
        iconColor = '';

    if (color_tone === 'primary') {
        iconBgColor = 'bg-primary-50';
        iconColor = 'text-primary-600';
    } else if (color_tone === 'secondary') {
        iconBgColor = 'bg-secondary-50';
        iconColor = 'text-secondary-600';
    } else {
        iconBgColor = 'bg-text-color-10';
        iconColor = 'text-text-color-60';
    }

    const endnotes = lists[0]?.map((list) => {
        const { paragraphs, lists } = list;

        const children = lists[0]?.map((list) => {
            const { paragraphs } = list;

            return paragraphs;
        });

        return {
            content: paragraphs,
            subContent: children,
        };
    });

    return (
        <Container py="lg" className="max-w-8xl mx-auto">
            <div className="max-w-4xl mx-auto">
                {title && (
                    <h2 className="text-xl font-bold md:text-2xl lg:text-3xl text-center text-pretty">
                        {title}
                    </h2>
                )}
                {subtitle && (
                    <h3 className="mt-4 lg:mt-5 px-0 lg:px-8 text-base md:text-lg text-text-color-60 text-center text-pretty">
                        {subtitle}
                    </h3>
                )}
            </div>
            {items.length ? (
                <div className="mt-12 lg:mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {items.map((item, index) => {
                        const { icons, title, subtitle, paragraphs } = item;

                        const icon = icons[0];

                        return (
                            <div
                                className="w-full flex flex-col p-4 lg:p-6 rounded-md shadow-lg"
                                key={index}
                            >
                                {icon && (
                                    <div
                                        className={twJoin(
                                            'w-12 h-12 p-2.5 rounded-md',
                                            iconBgColor
                                        )}
                                    >
                                        <Icon
                                            icon={icon}
                                            className={twJoin('w-full h-full', iconColor)}
                                        />
                                    </div>
                                )}
                                {title && (
                                    <h3 className="mt-5 text-lg lg:text-xl font-medium">{title}</h3>
                                )}
                                {subtitle && (
                                    <p className="mt-1 text-base lg:text-lg text-text-color-60">
                                        {subtitle}
                                    </p>
                                )}
                                {paragraphs.length ? (
                                    <div className="mt-3 space-y-2">
                                        {paragraphs.map((paragraph, index) => {
                                            const [pre, post] = paragraph.split('|');

                                            if (pre && post) {
                                                return (
                                                    <div
                                                        key={index}
                                                        className="flex items-center justify-between gap-x-5"
                                                    >
                                                        <span className="w-1/2 text-sm lg:text-base font-light">
                                                            {pre}
                                                        </span>
                                                        <span className="w-1/2 text-sm lg:text-base font-medium text-right">
                                                            {post}
                                                        </span>
                                                    </div>
                                                );
                                            }

                                            return (
                                                <SafeHtml
                                                    key={index}
                                                    value={paragraph}
                                                    className="text-sm lg:text-base font-light"
                                                />
                                            );
                                        })}
                                    </div>
                                ) : null}
                            </div>
                        );
                    })}
                </div>
            ) : null}
            {endnotes ? (
                <ul className="mt-8 lg:mt-12 px-6 lg:px-8">
                    {endnotes.map((endnote, index) => {
                        return (
                            <li key={index} className="list-disc marker:text-text-color-50 py-1">
                                <SafeHtml
                                    value={endnote.content}
                                    className="text-sm lg:text-base text-text-color-70"
                                />
                                {endnote.subContent ? (
                                    <SafeHtml
                                        value={endnote.subContent}
                                        className="ml-2 text-sm lg:text-base text-text-color-70 py-1 space-y-1"
                                    />
                                ) : null}
                            </li>
                        );
                    })}
                </ul>
            ) : null}
        </Container>
    );
}
