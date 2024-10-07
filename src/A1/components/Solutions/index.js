import React from 'react';
import { Image, SafeHtml, Link, stripTags, getPageProfile } from '@uniwebcms/module-sdk';
import { HiArrowUpRight } from 'react-icons/hi2';
import Container from '../_utils/Container';

export default function Solutions({ block, website }) {
    const { main } = block;
    const items = block.getBlockItems();

    const { pretitle = '', title = '', subtitle = '', alignment = '' } = main.header || {};

    return (
        <Container>
            <div className='px-6 mx-auto max-w-7xl lg:px-8'>
                <div className={`lg:text-${alignment} px-6`}>
                    {pretitle ? (
                        <h3 className='mb-1 font-medium  text-lg md:text-xl lg:text-2xl'>{stripTags(pretitle)}</h3>
                    ) : null}
                    <h2 className='mt-2 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl'>
                        {stripTags(title)}
                    </h2>
                    {subtitle ? (
                        <h3 className='mt-4 text-xl text-text-color-80 md:text-2xl'>{stripTags(subtitle)}</h3>
                    ) : null}
                </div>
                <div className='mt-12'>
                    <dl className='grid max-w-xl grid-cols-1 gap-y-10 gap-x-8 lg:max-w-none lg:grid-cols-2 lg:gap-y-8'>
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
        <div className='relative p-8 transition-all ease-in-out border rounded-md hover:border-text-color-30 hover:scale-105 bg-text-color-10 hover:bg-text-color-0'>
            <dt className='flex flex-row justify-between text-base font-semibold leading-7'>
                {banner && (
                    <div className='flex items-center justify-center w-10 h-10 mb-6'>
                        <Image
                            profile={getPageProfile()}
                            value={banner.value}
                            url={banner.url}
                            alt={banner.alt}
                            className='w-10 h-10 rounded-lg'
                        />
                    </div>
                )}
                {isLink && (
                    <div className='flex items-center justify-center w-10 h-10 mb-6'>
                        <HiArrowUpRight className='w-6 h-6 text-link-color hover:underline' aria-hidden='true' />
                    </div>
                )}
            </dt>
            <h3 className='font-semibold '>{stripTags(title)}</h3>
            <SafeHtml value={paragraphs} as='dd' className='mt-2 text-base leading-7 text-text-color-80 line-clamp-4' />
        </div>
    );
};
