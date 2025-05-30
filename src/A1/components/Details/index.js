import React from 'react';
import { stripTags } from '@uniwebcms/module-sdk';
import { SafeHtml } from '@uniwebcms/core-components';
import { Disclosure } from '@headlessui/react';
import { HiMinusSm, HiPlusSm } from 'react-icons/hi';
import Container from '../_utils/Container';

/* This example requires Tailwind CSS v3.0+ */
export default function Details({ block }) {
    const { main } = block;

    const { title = '', subtitle = '' } = main.header || {};

    const { alignment = 'left', vertical_padding = 'lg' } = block.getBlockProperties();

    const items = block.getBlockItems();

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

    if (alignment === 'center') return centerAligned(title, subtitle, items, py);

    return (
        <Container py={py}>
            <div className="px-6 mx-auto max-w-7xl lg:px-8">
                <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                    {alignment === 'right' && (
                        <div className="lg:col-span-5">
                            <SafeHtml
                                as="h2"
                                value={title}
                                className="text-xl font-bold tracking-tight md:text-2xl lg:text-3xl rich-text"
                            />
                            {subtitle ? (
                                <SafeHtml
                                    as="p"
                                    value={subtitle}
                                    className="mt-4 text-base leading-8 md:text-lg lg:text-xl text-text-color-80 rich-text"
                                />
                            ) : null}
                        </div>
                    )}
                    <div className={'lg:col-span-7'}>
                        <dl className="space-y-10">
                            {items.map((item, index) => (
                                <div key={index}>
                                    <dt className="text-lg font-semibold leading-7 md:text-xl">
                                        <SafeHtml
                                            as="h3"
                                            value={item.title}
                                            className="rich-text"
                                        />
                                    </dt>
                                    <dd className="mt-2 text-base md:text-lg leading-7 text-text-color-90">
                                        <SafeHtml value={item.paragraphs} className="rich-text" />
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                    {alignment === 'left' && (
                        <div className="lg:col-span-5 lg:pl-8">
                            <SafeHtml
                                as="h2"
                                value={title}
                                className="text-xl font-bold tracking-tight md:text-2xl lg:text-3xl rich-text"
                            />
                            {subtitle ? (
                                <SafeHtml
                                    as="p"
                                    value={subtitle}
                                    className="mt-4 text-base leading-8 md:text-lg lg:text-xl text-text-color-8 rich-text"
                                />
                            ) : null}
                        </div>
                    )}
                </div>
            </div>
        </Container>
    );
}

function centerAligned(title, subtitle, items, py) {
    return (
        <Container py={py}>
            <div className="px-6 mx-auto max-w-7xl lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div>
                        <h2 className="text-xl font-bold tracking-tight  md:text-2xl lg:text-3xl">
                            {stripTags(title)}
                        </h2>
                        {subtitle ? (
                            <p className="mt-4 text-base leading-8 md:text-lg lg:text-xl !text-neutral-900">
                                {stripTags(subtitle)}
                            </p>
                        ) : null}
                    </div>
                    <dl className="mt-10 space-y-6">
                        {items.map((item, index) => (
                            <Disclosure
                                as="div"
                                key={index}
                                className="pt-6 border-t-[1px] border-neutral-400"
                            >
                                {({ open }) => (
                                    <>
                                        <dt>
                                            <Disclosure.Button className="flex items-start justify-between w-full text-left  focus:outline-none group">
                                                <SafeHtml
                                                    as="h3"
                                                    value={item.title}
                                                    className={`text-base font-semibold leading-7 md:text-lg rich-text ${
                                                        open
                                                            ? 'opacity-100'
                                                            : 'opacity-80 group-hover:opacity-100'
                                                    }`}
                                                />
                                                <span className="flex items-center ml-6 h-7">
                                                    {open ? (
                                                        <HiMinusSm
                                                            className="w-6 h-6"
                                                            aria-hidden="true"
                                                        />
                                                    ) : (
                                                        <HiPlusSm
                                                            className="w-6 h-6"
                                                            aria-hidden="true"
                                                        />
                                                    )}
                                                </span>
                                            </Disclosure.Button>
                                        </dt>
                                        <Disclosure.Panel
                                            as="dd"
                                            className="pr-12 mt-2 prose max-w-none"
                                        >
                                            <SafeHtml
                                                value={item.paragraphs}
                                                className="text-base leading-7 text-neutral-800 rich-text"
                                            />
                                        </Disclosure.Panel>
                                    </>
                                )}
                            </Disclosure>
                        ))}
                    </dl>
                </div>
            </div>
        </Container>
    );
}
