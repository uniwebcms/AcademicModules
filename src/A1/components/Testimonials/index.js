import React, { useState } from 'react';
import { Image, SafeHtml, twMerge, stripTags } from '@uniwebcms/module-sdk';
import Container from '../_utils/Container';
import { HiOutlineArrowLeft, HiOutlineArrowRight } from 'react-icons/hi';

const islandHeight = 33;

export default function Testimonials({ website, block }) {
    const { main } = block;
    const { banner, header } = main;

    const items = block.getBlockItems();

    const [current, setCurrent] = useState(0);

    const currentItem = items[current];

    const siteProfile = website.getSiteProfile();

    return (
        <Container className='!py-0'>
            <div className={`relative hidden lg:block min-h-[45rem]`}>
                {banner ? (
                    <div className='absolute inset-0'>
                        <Image
                            profile={siteProfile}
                            value={banner.value}
                            alt={banner.alt}
                            url={banner.url}
                            className='object-cover w-full h-full saturate-[70%]'
                        />
                    </div>
                ) : null}
                <div className='flex flex-row justify-center align-centre min-h-[45rem] items-center'>
                    <div className='relative z-40 p-8 2xl:ml-16 2xl:mr-32 max-w-1/2 rounded-xl lg:mx-16 bg-text-color-20 backdrop-saturate-200 backdrop-blur-lg'>
                        {header?.title ? (
                            <h2 className='px-4 2xl:text-4xl font-bold lg:text-2xl'>{stripTags(header.title)}</h2>
                        ) : null}
                        {header?.subtitle ? (
                            <h3 className='mt-4 px-4 2xl:text-2xl lg:text-lg text-text-color-80'>
                                {stripTags(header.subtitle)}
                            </h3>
                        ) : null}
                    </div>
                    <div
                        className={twMerge(
                            `z-40 flex mr-16 max-h-[${islandHeight}rem] min-h-[${islandHeight}rem] max-w-1/2`
                        )}>
                        {items.length > 1 && (
                            <div
                                className={`h-[${islandHeight}rem] w-[4rem] rounded-l-[4rem] bg-text-color/20 flex items-center justify-center group`}
                                onClick={() => {
                                    setCurrent(current === 0 ? items.length - 1 : current - 1);
                                }}>
                                <HiOutlineArrowLeft className='w-6 h-6 text-text-color-80 transition-all group-hover:scale-125' />
                            </div>
                        )}
                        <div
                            className={`w-[44rem] min-h-[${islandHeight}rem] bg-text-color-10 flex flex-row ${
                                items.length === 1 ? 'rounded-3xl' : ''
                            }`}>
                            <div className='flex flex-col justify-between px-8 pt-16 pb-6 mx-4 lg:mx-8 w-full'>
                                <div className='flex flex-col justify-between h-[87%]'>
                                    <div>
                                        <div>
                                            {currentItem.banner ? (
                                                <Image
                                                    profile={siteProfile}
                                                    value={currentItem.banner.value}
                                                    alt={currentItem.banner.alt}
                                                    url={currentItem.banner.url}
                                                    className='object-contain h-16'
                                                />
                                            ) : null}
                                        </div>

                                        <div className='mb-8'>
                                            <svg
                                                width='30'
                                                height='24'
                                                viewBox='0 0 30 24'
                                                fill='none'
                                                xmlns='http://www.w3.org/2000/svg'
                                                className=' translate-x-[-2rem] translate-y-6 opacity-70 text-primary-200'>
                                                <path
                                                    d='M8.352 0C3.456 3.456 0 9.12 0 15.36C0 20.448 3.072 23.424 6.624 23.424C9.984 23.424 12.48 20.736 12.48 17.568C12.48 14.4 10.272 12.096 7.392 12.096C6.816 12.096 6.048 12.192 5.856 12.288C6.336 9.024 9.408 5.184 12.48 3.264L8.352 0ZM24.864 0C20.064 3.456 16.608 9.12 16.608 15.36C16.608 20.448 19.68 23.424 23.232 23.424C26.496 23.424 29.088 20.736 29.088 17.568C29.088 14.4 26.784 12.096 23.904 12.096C23.328 12.096 22.656 12.192 22.464 12.288C22.944 9.024 25.92 5.184 28.992 3.264L24.864 0Z'
                                                    fill='#4F46E5'
                                                />
                                            </svg>
                                            <SafeHtml
                                                value={currentItem.paragraphs}
                                                className='ml-4 z-10 text-xl leading-10 font-inter'
                                            />
                                        </div>
                                    </div>

                                    <div className='flex flex-row items-center'>
                                        {currentItem.images[0] && (
                                            <Image
                                                profile={siteProfile}
                                                value={currentItem.images[0].value}
                                                alt={currentItem.images[0].alt}
                                                url={currentItem.images[0].url}
                                                className='w-16 h-16 rounded-full'
                                            />
                                        )}
                                        <div className='mx-6'>
                                            <SafeHtml
                                                value={currentItem.title}
                                                className='text-xl font-bold font-inter'
                                            />
                                        </div>
                                    </div>
                                </div>
                                {items.length > 1 && (
                                    <div id='dots' className='flex flex-row justify-center mt-8'>
                                        {items.map((_, index) => {
                                            if (index === current) {
                                                return (
                                                    <div
                                                        key={index}
                                                        className='w-3 h-3 mx-2 transition-all bg-text-color-80 rounded-full'></div>
                                                );
                                            }
                                            return (
                                                <div
                                                    key={index}
                                                    className='w-3 h-3 mx-2 transition-all bg-text-color-40 rounded-full hover:bg-text-color-60 hover:cursor-pointer'
                                                    onClick={() => {
                                                        setCurrent(index);
                                                    }}></div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                        {items.length > 1 && (
                            <div
                                className={`h-[${islandHeight}rem] w-[4rem] rounded-r-[4rem] bg-text-color/20 flex items-center justify-center group`}
                                onClick={() => setCurrent(current === items.length - 1 ? 0 : current + 1)}>
                                <HiOutlineArrowRight className='w-6 h-6 text-text-color-80 transition-all group-hover:scale-125' />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile UI */}
            <div className='block lg:hidden h-fit'>
                {/* Title and subtitle */}
                <div className='flex flex-col items-center justify-center my-4'>
                    {header?.title ? (
                        <SafeHtml as='h2' value={header.title} className='px-4 text-3xl font-bold' />
                    ) : null}
                    {header?.subtitle ? <SafeHtml as='h3' value={header.subtitle} className='px-4 text-xl' /> : null}
                </div>
                <div
                    id='scrollable'
                    className='grid grid-flow-col overflow-y-auto overscroll-x-contain snap-mandatory snap-always snap-x'>
                    {items.map((item, index) => (
                        <React.Fragment key={index}>
                            <div
                                className={`w-[90vw] h-[23rem] snap-center p-8 mx-2 bg-text-color-10 rounded-3xl shadow-2xl border flex snap-always flex-col justify-between`}>
                                {item.banner ? (
                                    <div>
                                        <Image
                                            profile={siteProfile}
                                            value={item.banner.value}
                                            url={item.banner.url}
                                            alt={item.banner.alt}
                                            className='object-contain h-12'
                                        />
                                    </div>
                                ) : null}
                                <div>
                                    <SafeHtml
                                        value={item.paragraphs}
                                        className='text-text-color-90 text-lg line-clamp-3'
                                    />
                                </div>
                                <div className='flex flex-row items-center'>
                                    {item.images[0] && (
                                        <Image
                                            profile={siteProfile}
                                            value={item.images[0].value}
                                            url={item.images[0].url}
                                            alt={item.images[0].alt}
                                            className='w-12 h-12 rounded-full'
                                        />
                                    )}
                                    <div className='px-2'>
                                        <SafeHtml value={item.title} className='text-sm' />
                                    </div>
                                </div>
                            </div>
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </Container>
    );
}
