import React from 'react';
import { getPageProfile } from '@uniwebcms/module-sdk';
import { SafeHtml, Image, Link } from '@uniwebcms/core-components';
import { HiArrowUpRight } from 'react-icons/hi2';
import Container from '../_utils/Container';

export default function Solutions({ block, website }) {
    const { main } = block;
    const items = block.getBlockItems();

    const { pretitle = '', title = '', subtitle = '', alignment = '' } = main.header || {};

    let py = '';

    const { vertical_padding = 'lg' } = block.getBlockProperties();

    if (vertical_padding === 'none') {
        py = 'py-0 lg:py-0';
    } else if (vertical_padding === 'sm') {
        py = 'py-6 lg:py-12';
    } else if (vertical_padding === 'md') {
        py = 'py-8 lg:py-16';
    } else if (vertical_padding === 'lg') {
        py = 'py-12 lg:py-24';
    }

    return (
        <Container py={py}>
            <div className="px-6 mx-auto max-w-7xl lg:px-8">
                <div className={`lg:text-${alignment} px-6`}>
                    {pretitle && (
                        <SafeHtml
                            as="p"
                            value={pretitle}
                            className="mb-1 font-medium  text-lg md:text-xl lg:text-2xl rich-text"
                        />
                    )}
                    <SafeHtml
                        as="h2"
                        value={title}
                        className="mt-2 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl rich-text"
                    />
                    {subtitle ? (
                        <SafeHtml
                            as="p"
                            value={subtitle}
                            className="mt-4 text-xl text-text-color-80 md:text-2xl rich-text"
                        />
                    ) : null}
                </div>
                <div className="mt-12">
                    <dl className="grid max-w-xl grid-cols-1 gap-y-10 gap-x-8 lg:max-w-none lg:grid-cols-2 lg:gap-y-8">
                        {items.map((item, index) => {
                            const { links } = item;
                            const link = links[0];

                            if (link)
                                return (
                                    <Link to={website.makeHref(link.href)} key={index}>
                                        <FeatureCard feature={item} isLink={true} />
                                    </Link>
                                );
                            return <FeatureCard key={index} feature={item} />;
                        })}
                    </dl>
                </div>
            </div>
        </Container>
    );
}

const FeatureCard = ({ feature, isLink = false }) => {
    const { banner, title, paragraphs } = feature;

    return (
        <div className="relative p-8 transition-all ease-in-out border rounded-md hover:border-text-color-30 hover:scale-105 bg-text-color-10 hover:bg-text-color-0">
            <dt className="flex flex-row justify-between text-base font-semibold leading-7">
                {banner && (
                    <div className="flex items-center justify-center w-10 h-10 mb-6">
                        <Image
                            profile={getPageProfile()}
                            {...banner}
                            className="w-10 h-10 rounded-lg"
                        />
                    </div>
                )}
                {isLink && (
                    <div className="flex items-center justify-center w-10 h-10 mb-6">
                        <HiArrowUpRight
                            className="w-6 h-6 text-link-color hover:underline"
                            aria-hidden="true"
                        />
                    </div>
                )}
            </dt>

            <SafeHtml as="h3" value={title} className="font-semibold rich-text" />

            <SafeHtml
                value={paragraphs}
                as="dd"
                className="mt-2 text-base leading-7 text-text-color-80 rich-text"
            />
        </div>
    );
};
