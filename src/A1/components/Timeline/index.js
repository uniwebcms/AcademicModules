import React from 'react';
import { SafeHtml, Image, twMerge, twJoin, stripTags, getPageProfile } from '@uniwebcms/module-sdk';
import Container from '../_utils/Container';

export default function Timeline({ block }) {
    const { main } = block;

    const { pretitle, title, subtitle } = main.header;

    const items = block.getBlockItems();

    return (
        <Container className='flex flex-col items-center justify-center'>
            {/* background image */}
            {main.banner && (
                <div className='absolute inset-0 w-full h-full z-0'>
                    <Image
                        profile={getPageProfile()}
                        value={main.banner.value}
                        alt={main.banner.alt}
                        url={main.banner.url}
                        className='object-cover w-full h-full'
                    />
                    <div className='absolute inset-0 bg-text-color-10 mix-blend-multiply' aria-hidden='true' />
                </div>
            )}
            <div className='z-10 text-center mx-auto max-w-3xl'>
                {pretitle && <h3 className='mb-3 text-xl font-light md:text-2xl lg:text-3xl'>{stripTags(pretitle)}</h3>}
                <h2 className='text-3xl font-bold  md:text-4xl lg:text-5xl'>{stripTags(title)}</h2>
                {subtitle && (
                    <p className='mt-4 text-base md:text-lg lg:text-xl text-text-color-80'>{stripTags(subtitle)}</p>
                )}
            </div>

            <div className='mt-16 lg:border-text-neutral-800 w-[100%] z-10 max-w-7xl'>
                <nav aria-label='Progress'>
                    <ol
                        role='list'
                        className='overflow-hidden rounded-sm lg:flex lg:border-l lg:border-r lg:border-neutral-700 rounded-l-md rounded-r-md'>
                        {items.map((item, index) => (
                            <li
                                key={index}
                                className={twJoin(
                                    'relative overflow-hidden border-t border-b border-text-color-70 bg-text-color-10 lg:flex-1',
                                    index === 0 ? 'rounded-l-md' : '',
                                    index === items.length - 1 ? 'rounded-r-md' : ''
                                )}>
                                <div
                                    className={twMerge(
                                        'border border-text-color-30 overflow-hidden lg:border-0',
                                        index === 0 ? 'border-b-0 rounded-t-md' : '',
                                        index === items.length - 1 ? 'border-t-0 rounded-b-md' : ''
                                    )}>
                                    <div
                                        className={`px-6 py-5 flex items-start text-sm font-medium ${
                                            index !== 0 ? 'lg:pl-9' : ''
                                        }`}>
                                        <span className='flex-shrink-0'>
                                            <div className='flex items-center justify-center w-10 h-10 border-2 rounded-full border-text-color-70'>
                                                <div className='text-text-color-80'>{index + 1}</div>
                                            </div>
                                        </span>
                                        <div className='mt-0.5 ml-4 flex min-w-0 flex-col space-y-2'>
                                            {item.title ? (
                                                <h3 className='text-base font-medium '>{item.title}</h3>
                                            ) : null}
                                            <SafeHtml value={item.paragraphs} className='text-sm text-text-color-80' />
                                        </div>
                                    </div>
                                    {index !== 0 ? (
                                        <>
                                            {/* Separator */}
                                            <div
                                                className='absolute inset-0 top-0 left-0 hidden w-3 lg:block'
                                                aria-hidden='true'>
                                                <svg
                                                    className='w-full h-full'
                                                    viewBox='0 0 12 82'
                                                    fill='none'
                                                    preserveAspectRatio='none'>
                                                    <path
                                                        d='M0.5 0V31L10.5 41L0.5 51V82'
                                                        stroke='currentcolor'
                                                        vectorEffect='non-scaling-stroke'
                                                    />
                                                </svg>
                                            </div>
                                        </>
                                    ) : null}
                                </div>
                            </li>
                        ))}
                    </ol>
                </nav>
            </div>
        </Container>
    );
}
