import React from 'react';
import { SafeHtml } from '@uniwebcms/module-sdk';
import Container from '../_utils/Container';
import Fancy from './Fancy';

export default function FAQ(props) {
    const { block } = props;

    const { title, subtitle } = block.getBlockContent();

    const items = block.getBlockItems();

    const { appearance = 'subtle' } = block.getBlockProperties();

    if (appearance === 'subtle') {
        return (
            <Container className="max-w-7xl mx-auto">
                <div>
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
                <dl className="mt-10 space-y-8 divide-y divide-gray-900/10">
                    {items.map((item, index) => (
                        <div key={index} className="pt-8 lg:grid lg:grid-cols-12 lg:gap-8">
                            <dt className="text-base lg:text-lg font-semibold lg:col-span-5">
                                {item.title}
                            </dt>
                            <dd className="mt-4 lg:col-span-7 lg:mt-0">
                                <SafeHtml
                                    value={item.paragraphs}
                                    className="text-base text-text-color-60"
                                />
                            </dd>
                        </div>
                    ))}
                </dl>
            </Container>
        );
    }

    return <Fancy {...{ title, subtitle, items }} />;
}
