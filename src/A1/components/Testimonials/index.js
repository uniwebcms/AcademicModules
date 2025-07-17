import React, { useState } from 'react';
import { twJoin, stripTags, getPageProfile } from '@uniwebcms/module-sdk';
import { Image, SafeHtml } from '@uniwebcms/core-components';
import { ImQuotesLeft } from 'react-icons/im';
import { HiOutlineArrowLeft, HiOutlineArrowRight } from 'react-icons/hi';
import Container from '../_utils/Container';

const islandHeight = 33;

export default function Testimonials(props) {
    const { block } = props;
    const { banner, title, subtitle } = block.getBlockContent();
    const items = block.getBlockItems();

    const [current, setCurrent] = useState(0);

    const currentItem = items[current];

    return (
        <Container>
            {banner ? (
                <div className="absolute inset-0">
                    <Image
                        profile={getPageProfile()}
                        {...banner}
                        className="object-cover w-full h-full saturate-[70%]"
                    />
                </div>
            ) : null}
            <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col lg:flex-row justify-center items-center z-10 gap-12">
                <div className="hidden lg:block relative p-8 rounded-xl bg-bg-color/50 backdrop-saturate-200 backdrop-blur-lg">
                    {title ? (
                        <h2 className="text-xl lg:text-2xl 2xl:text-3xl font-bold">{title}</h2>
                    ) : null}
                    {subtitle ? (
                        <h3 className="mt-4 text-base lg:text-lg 2xl:text-xl text-text-color-80 text-auto">
                            {subtitle}
                        </h3>
                    ) : null}
                </div>
                <div
                    className={twJoin(
                        'relative max-w-3xl mx-auto lg:ml-auto lg:mr-0 w-full rounded-3xl bg-bg-color/60 backdrop-saturate-200 backdrop-blur-lg',
                        items.length > 1 ? 'px-24 pt-8 pb-14' : 'px-20 py-8'
                    )}
                >
                    {/* arrow to the left */}
                    {items.length > 1 && (
                        <button
                            className="absolute left-4 top-1/2 -translate-y-1/2 focus:outline-none"
                            disabled={current === 0}
                            onClick={() =>
                                setCurrent(current === 0 ? items.length - 1 : current - 1)
                            }
                        >
                            <HiOutlineArrowLeft
                                className={twJoin(
                                    'w-6 h-6',
                                    current === 0
                                        ? 'cursor-not-allowed text-text-color-40'
                                        : 'text-text-color-60 transition-all hover:text-text-color-80 hover:scale-125 duration-300'
                                )}
                            />
                        </button>
                    )}

                    <div className="flex flex-col">
                        <div
                            className={twJoin(
                                'block lg:hidden border-b border-text-color/40 pb-8 mb-8 text-center',
                                items.length > 1 ? '-mx-24 px-24' : '-mx-20 px-20'
                            )}
                        >
                            {title ? (
                                <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
                            ) : null}
                            {subtitle ? (
                                <h3 className="mt-2 text-lg md:text-xl text-text-color-80">
                                    {subtitle}
                                </h3>
                            ) : null}
                        </div>

                        {/* leading image */}
                        {currentItem.banner ? (
                            <div className="mb-4">
                                <Image
                                    profile={getPageProfile()}
                                    {...currentItem.banner}
                                    className="object-contain h-12 md:h-14 lg:h-16"
                                />
                            </div>
                        ) : null}

                        {/* quote */}
                        <div className="relative mb-8">
                            <ImQuotesLeft className="absolute -top-7 -left-2 w-7 h-7 -translate-x-10 translate-y-6 opacity-70 text-accent-600" />
                            <SafeHtml
                                value={currentItem.paragraphs}
                                className="text-lg md:text-xl leading-8 [&>p+p]:mt-4 text-center lg:text-left"
                            />
                        </div>

                        {/* author */}
                        <div className="flex items-center justify-center lg:justify-start">
                            {currentItem.images[0] && (
                                <Image
                                    profile={getPageProfile()}
                                    {...currentItem.images[0]}
                                    className="w-16 h-16 rounded-full"
                                />
                            )}
                            <div className="mx-6 text-lg md:text-xl font-bold font-inter">
                                <p>{stripTags(currentItem.title)}</p>
                                <p>{stripTags(currentItem.subtitle)}</p>
                            </div>
                        </div>
                    </div>
                    {/* {items.length > 1 && (
                        <div id="dots" className="flex flex-row justify-center mt-8">
                            {items.map((_, index) => {
                                if (index === current) {
                                    return (
                                        <div
                                            key={index}
                                            className="w-3 h-3 mx-2 transition-all bg-text-color-80 rounded-full"
                                        ></div>
                                    );
                                }
                                return (
                                    <div
                                        key={index}
                                        className="w-3 h-3 mx-2 transition-all bg-text-color-40 rounded-full hover:bg-text-color-60 hover:cursor-pointer"
                                        onClick={() => {
                                            setCurrent(index);
                                        }}
                                    ></div>
                                );
                            })}
                        </div>
                    )} */}

                    {/* arrow to the right */}
                    {items.length > 1 && (
                        <button
                            className="absolute right-4 top-1/2 -translate-y-1/2 focus:outline-none"
                            disabled={current === items.length - 1}
                            onClick={() =>
                                setCurrent(current === items.length - 1 ? 0 : current + 1)
                            }
                        >
                            <HiOutlineArrowRight
                                className={twJoin(
                                    'w-6 h-6',
                                    current === items.length - 1
                                        ? 'cursor-not-allowed text-text-color-40'
                                        : 'text-text-color-60 transition-all hover:text-text-color-80 hover:scale-125 duration-300'
                                )}
                            />
                        </button>
                    )}
                </div>
            </div>
        </Container>
    );
}
