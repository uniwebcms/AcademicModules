import React from 'react';
import { stripTags, getPageProfile, twJoin } from '@uniwebcms/module-sdk';
import { Image, Link } from '@uniwebcms/core-components';
import Container from '../_utils/Container';

export default function LogoCloud({ block }) {
    const { main } = block;

    const items = block.getBlockItems();

    const { title = '', subtitle = '' } = main?.header || {};

    const { vertical_padding = 'lg' } = block.getBlockProperties();

    let py = '';

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
                <h2 className="text-3xl font-semibold text-center">{stripTags(title)}</h2>
                <h3 className="mt-2 text-xl font-medium text-center text-text-color-70">
                    {stripTags(subtitle)}
                </h3>
                <div className="mt-8 md:mt-12 flex flex-wrap justify-center gap-0.5 lg:mt-8">
                    {items.map(({ banner, links }, index) => {
                        const link = links[0];

                        const Wrapper = link ? Link : 'div';
                        const wrapperProps = link ? { to: link.href, target: '_blank' } : {};

                        return (
                            <Wrapper
                                key={index}
                                {...wrapperProps}
                                className={twJoin(
                                    'w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 2xl:w-1/6 h-20 flex items-center justify-center p-6 transition-all ease-in-out bg-text-color-10',
                                    link ? 'hover:bg-text-color-70 cursor-pointer' : ''
                                )}
                            >
                                {banner ? (
                                    <Image
                                        profile={getPageProfile()}
                                        value={banner.value}
                                        url={banner.url}
                                        alt={banner.alt}
                                        className={`object-contain max-h-16 w-full`}
                                    ></Image>
                                ) : null}
                            </Wrapper>
                        );
                    })}
                </div>
            </div>
        </Container>
    );
}
