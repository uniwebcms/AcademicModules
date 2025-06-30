import React from 'react';
import { Image, Link, SafeHtml } from '@uniwebcms/core-components';

export default function FeatureCard(props) {
    const { block, page } = props;

    const { title, subtitle } = block.getBlockContent();

    const items = block.getBlockItems();

    return (
        <div className="px-6 py-12">
            <div className="max-w-[1400px] mx-auto">
                <div className="text-center">
                    <h2 className="text-[42px] md:text-[48px] xl:text-[72px] leading-[118%] md:leading-[112%]">
                        {title}
                    </h2>
                    <p className="text-lg text-heading-color-70 mt-4">{subtitle}</p>
                </div>
                <ul className="grid lg:grid-cols-3 mt-8 sm:mt-14 gap-4 sm:gap-6">
                    {items.map((item, index) => {
                        const { banner, title, paragraphs, links } = item;
                        const link = links[0];

                        const Wrapper = link ? Link : 'div';
                        const wrapperProps = link ? { to: link.href } : {};

                        return (
                            <li key={index}>
                                <Wrapper
                                    {...wrapperProps}
                                    className="relative block h-full bg-text-color-10 p-6 sm:p-8 rounded-[12px] text-left hover:bg-text-color-20"
                                >
                                    <Image
                                        profile={page.getPageProfile()}
                                        {...banner}
                                        className="object-cover rounded-lg w-full h-auto aspect-square"
                                    />
                                    <h3 className="mt-6 sm:mt-8 text-2xl leading-[130%] -tracking-[0.48px]">
                                        {title}
                                    </h3>
                                    <SafeHtml
                                        value={paragraphs}
                                        className="mt-2 sm:mt-4 text-lg text-text-color-70 leading-[150%] -tracking-[0.36px]"
                                    />
                                </Wrapper>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}
