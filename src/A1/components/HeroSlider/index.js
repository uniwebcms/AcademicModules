import React from 'react';
import { Carousel } from 'flowbite-react';
import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';
import { SafeHtml, Link, Image, twJoin, getPageProfile } from '@uniwebcms/module-sdk';
import Container from '../_utils/Container';
import './style.css';

const Item = ({ item, properties, block }) => {
    let { themeName } = block;
    let { banner, pretitle, title, subtitle, paragraphs, links, titleAlign } = item;

    const {
        min_height = '100vh',
        show_back_drop = false,
        show_gradient = false,
        gradient_from_pos = 'bottom',
    } = properties;

    const alignmentH = properties.horizontal_alignment || titleAlign || 'center';
    const alignmentV = properties.vertical_alignment || 'center';

    paragraphs = paragraphs?.filter(Boolean);

    const hasContent = title || pretitle || subtitle || paragraphs?.length || links?.length;

    const content = (
        <div
            className={twJoin(
                'flex h-full xl:px-12 2xl:px-32 py-4',
                min_height !== '100vh' ? '!pt-8' : '',
                alignmentH === 'center' ? 'justify-center' : '',
                alignmentH === 'left' ? 'justify-start' : '',
                alignmentH === 'right' ? 'justify-end' : '',
                alignmentV === 'center' ? 'items-center' : '',
                alignmentV === 'top' ? 'items-start' : '',
                alignmentV === 'bottom' ? 'items-end' : ''
            )}
        >
            <div
                className={twJoin(
                    'z-10 max-w-7xl relative flex justify-center text-center px-12 md:px-16 rounded-2xl',
                    !hasContent ? 'hidden' : '',
                    show_back_drop ? 'my-12 md:my-16 py-10 md:py-16' : 'my-8 md:my-10 py-8 md:py-12'
                )}
            >
                <div className="relative lg:w-full lg:max-w-2xl">
                    <div className="relative">
                        <div>
                            {pretitle ? (
                                <SafeHtml
                                    value={pretitle}
                                    as="h2"
                                    className="mb-1 lg:mb-3 text-xl sm:text-2xl"
                                />
                            ) : null}
                            <SafeHtml
                                as="h1"
                                className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
                                value={title}
                            />
                            {subtitle ? (
                                <SafeHtml
                                    value={subtitle}
                                    as="h2"
                                    className="mt-2 lg:mt-4 leading-8 text-lg sm:text-xl"
                                />
                            ) : null}
                            {paragraphs?.length ? (
                                <SafeHtml
                                    value={paragraphs}
                                    className="text-base mb-2 mt-4 lg:mt-6 lg:text-[17px]"
                                />
                            ) : null}
                            {links?.length ? (
                                <div className="flex mt-6 lg:mt-8 items-center justify-center md:space-x-6 space-x-4">
                                    {links.map((link, index) => {
                                        if (index === 0) {
                                            return (
                                                <Link
                                                    key={index}
                                                    to={link.href}
                                                    className="rounded-md bg-primary-200 px-4 py-2.5 text-sm md:text-base !text-primary-800 font-semibold shadow-sm hover:bg-primary-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                                >
                                                    {link.label}
                                                </Link>
                                            );
                                        } else
                                            return (
                                                <Link
                                                    key={index}
                                                    to={link.href}
                                                    className="text-sm md:text-base font-semibold leading-6 text-primary-200 hover:underline hover:text-primary-300"
                                                >
                                                    {link.label}{' '}
                                                    <span className="text-primary-200">→</span>
                                                </Link>
                                            );
                                    })}
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
                {show_back_drop ? (
                    <div
                        className="absolute w-full h-full top-0 left-0 bg-text-color-10 opacity-90 rounded-2xl"
                        style={{ zIndex: -1 }}
                    ></div>
                ) : null}
            </div>
        </div>
    );

    let gradient_to =
        themeName === 'context__dark'
            ? 'after:to-black'
            : themeName === 'context__light'
            ? 'after:to-white'
            : 'after:to-bg-color';

    const gradient = `after:absolute after:inset-0 after:from-transparent after:z-0 ${gradient_to} ${
        gradient_from_pos === 'top'
            ? 'after:bg-gradient-to-t after:from-50%'
            : 'after:bg-gradient-to-b'
    }`;

    return (
        <div className={show_gradient ? gradient : ''} style={{ height: min_height }}>
            {banner && (
                <div className="absolute inset-0">
                    <Image
                        profile={getPageProfile()}
                        value={banner.value}
                        alt={banner.alt}
                        url={banner.url}
                        className="object-cover w-full h-full"
                    />
                </div>
            )}
            {content}
        </div>
    );
};

export default function HeroSlider(props) {
    const { block } = props;

    const {
        bg_size = 'full',
        slider_indicator: showIndicator = true,
        ...properties
    } = block.getBlockProperties();

    const items = block.getBlockItems();

    if (!items.length) return null;
    else if (items.length === 1) {
        return (
            <Container py="0">
                <div
                    className={
                        bg_size !== 'full'
                            ? 'relative max-w-7xl mx-auto rounded-lg overflow-hidden'
                            : ''
                    }
                >
                    <Item item={items[0]} properties={properties} block={block} />
                </div>
            </Container>
        );
    } else {
        return (
            <Container py="0">
                <div
                    className={
                        bg_size !== 'full'
                            ? 'relative max-w-7xl mx-auto rounded-lg overflow-hidden'
                            : ''
                    }
                >
                    <Carousel
                        pauseOnHover
                        leftControl={
                            <div className="w-10 h-10 p-2 rounded-full bg-text-color/60 hover:bg-text-color/70">
                                <HiOutlineChevronLeft className="w-full h-full text-text-color" />
                            </div>
                        }
                        rightControl={
                            <div className="w-10 h-10 p-2 rounded-full bg-text-color/60 hover:bg-text-color/70">
                                <HiOutlineChevronRight className="w-full h-full text-text-color" />
                            </div>
                        }
                        indicators={showIndicator}
                        theme={{
                            root: {
                                leftControl:
                                    'absolute top-0 left-0 flex h-full items-center justify-center px-4 focus:outline-none controlParent',
                                rightControl:
                                    'absolute top-0 right-0 flex h-full items-center justify-center px-4 focus:outline-none controlParent',
                            },
                            indicators: {
                                active: {
                                    off: 'bg-text-color/50 hover:bg-text-color focus:outline-none',
                                    on: 'bg-text-color focus:outline-none',
                                },
                            },
                            scrollContainer: {
                                base:
                                    bg_size !== 'full'
                                        ? 'flex h-full snap-mandatory overflow-y-hidden overflow-x-scroll scroll-smooth rounded-lg'
                                        : 'flex h-full snap-mandatory overflow-y-hidden overflow-x-scroll scroll-smooth rounded-none',
                            },
                        }}
                    >
                        {items.map((item, index) => (
                            <Item key={index} item={item} properties={properties} block={block} />
                        ))}
                    </Carousel>
                </div>
            </Container>
        );
    }
}
