import React from 'react';
import Container from '../_utils/Container';
import { Icon, twJoin, stripTags } from '@uniwebcms/module-sdk';
import Fancy from './Fancy';

export default function PricingFeatures(props) {
    const { block } = props;
    const { title, subtitle, lists } = block.getBlockContent();

    const items = block.getBlockItems();

    const { appearance = 'subtle', appearance_preset = 'none' } = block.getBlockProperties();

    // const endnotes = lists[0]?.map((list) => {
    //     const { paragraphs, lists } = list;

    //     const children = lists[0]?.map((list) => {
    //         const { paragraphs } = list;

    //         return paragraphs;
    //     });

    //     return {
    //         content: paragraphs,
    //         subContent: children,
    //     };
    // });

    if (appearance === 'subtle') {
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
                            const {
                                icons,
                                title,
                                // subtitle,
                                lists,
                                // paragraphs,
                            } = item;

                            const icon = icons[0];

                            const features =
                                lists[0]?.map((item) => item.paragraphs[0])?.filter(Boolean) || [];

                            return (
                                <div
                                    className="w-full flex flex-col p-4 lg:p-6 rounded-md shadow-lg"
                                    key={index}
                                >
                                    {icon && (
                                        <div
                                            className={twJoin(
                                                'w-12 h-12 p-2.5 rounded-md bg-primary-50'
                                            )}
                                        >
                                            <Icon
                                                icon={icon}
                                                className={twJoin(
                                                    'w-full h-full',
                                                    'text-primary-600'
                                                )}
                                            />
                                        </div>
                                    )}
                                    {title && (
                                        <h3 className="mt-5 text-lg lg:text-xl font-medium">
                                            {title}
                                        </h3>
                                    )}
                                    {/* {subtitle && (
                                        <p className="mt-1 text-base lg:text-lg text-text-color-60">
                                            {subtitle}
                                        </p>
                                    )} */}
                                    <ul className="mt-3 pl-1 space-y-2 list-disc list-inside marker:text-text-color-50">
                                        {features.map((feature, index) => {
                                            return (
                                                <li
                                                    key={index}
                                                    className="text-sm lg:text-base font-light"
                                                >
                                                    {stripTags(feature)}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            );
                        })}
                    </div>
                ) : null}
                {/* {endnotes ? (
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
            ) : null} */}
            </Container>
        );
    }

    return <Fancy {...{ title, subtitle, items, uiPreset: appearance_preset }} />;
}
