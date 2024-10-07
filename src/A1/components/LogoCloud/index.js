import React from 'react';
import { Image, stripTags, getPageProfile, Link } from '@uniwebcms/module-sdk';
import Container from '../_utils/Container';

export default function LogoCloud({ block }) {
    const { main } = block;

    const items = block.getBlockItems();

    const { title = '', subtitle = '' } = main?.header || {};

    return (
        <Container>
            <div className='px-6 mx-auto max-w-7xl lg:px-8'>
                <h2 className='text-3xl font-semibold text-center'>{stripTags(title)}</h2>
                <h3 className='mt-2 text-xl font-medium text-center text-text-color-70'>{stripTags(subtitle)}</h3>
                <div className='mt-8 md:mt-12 flex flex-wrap justify-center gap-0.5 lg:mt-8'>
                    {items.map(({ banner, links }, index) => {
                        const link = links[0];

                        const Wrapper = link ? Link : 'div';
                        const wrapperProps = link ? { to: link.href, target: '_blank' } : {};

                        return (
                            <Wrapper
                                key={index}
                                {...wrapperProps}
                                className='w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 2xl:w-1/6 flex justify-center p-6 transition-all ease-in-out bg-text-color-10 hover:bg-text-color-70'>
                                {banner ? (
                                    <Image
                                        profile={getPageProfile()}
                                        value={banner.value}
                                        url={banner.url}
                                        alt={banner.alt}
                                        className={`object-contain max-h-16 w-full`}></Image>
                                ) : null}
                            </Wrapper>
                        );
                    })}
                </div>
            </div>
        </Container>
    );
}
