import React, { useState } from 'react';
import { SafeHtml, Icon } from '@uniwebcms/core-components';
import { HiPlus, HiMinus } from 'react-icons/hi';
import { twJoin } from '@uniwebcms/module-sdk';
import Container from '../_utils/Container';

export default function FAQ(props) {
    const { block } = props;

    const { title, subtitle, icons } = block.getBlockContent();

    const icon = icons[0];

    const items = block.getBlockItems();

    const {
        layout = 'q_left_a_right',
        initial_state = 'all_closed',
        with_border = false,
    } = block.getBlockProperties();

    const [openState, setOpenState] = useState(() => {
        if (initial_state === 'all_closed') {
            return items.map(() => false);
        } else {
            return items.map((item, index) => index === 0);
        }
    });

    if (layout === 'q_left_a_right' || layout === 'q_right_a_left') {
        return (
            <Container className="max-w-7xl mx-auto">
                <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
                    {icon && (
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 bg-icon-color/20">
                            <Icon icon={icon} className="w-8 h-8" />
                        </div>
                    )}
                    {title && (
                        <h2 className="text-xl font-bold md:text-2xl lg:text-3xl text-pretty">
                            {title}
                        </h2>
                    )}
                    {subtitle && (
                        <p className="mt-4 lg:mt-5 px-0 lg:px-8 text-base md:text-lg text-text-color-60 text-pretty">
                            {subtitle}
                        </p>
                    )}
                </div>
                <dl className="mt-10 lg:mt-14 space-y-8 divide-y divide-text-color/10">
                    {items.map((item, index) => (
                        <div
                            key={index}
                            className={twJoin(
                                'lg:grid lg:grid-cols-12 lg:gap-8',
                                index > 0 && 'pt-8'
                            )}
                        >
                            <dt
                                className={twJoin(
                                    'text-base md:text-lg font-semibold lg:col-span-5 text-heading-color/90',
                                    layout === 'q_left_a_right' && 'lg:order-1',
                                    layout === 'q_right_a_left' && 'lg:order-2 lg:text-right'
                                )}
                            >
                                {item.title}
                            </dt>
                            <dd
                                className={twJoin(
                                    'mt-4 lg:col-span-7 lg:mt-0',
                                    layout === 'q_left_a_right' && 'lg:order-2',
                                    layout === 'q_right_a_left' && 'lg:order-1'
                                )}
                            >
                                <SafeHtml
                                    value={item.paragraphs}
                                    className="text-sm md:text-base text-text-color"
                                />
                            </dd>
                        </div>
                    ))}
                </dl>
            </Container>
        );
    } else {
        return (
            <Container className="max-w-7xl mx-auto">
                <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
                    {icon && (
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 bg-icon-color/20">
                            <Icon icon={icon} className="w-8 h-8" />
                        </div>
                    )}
                    {title && (
                        <h2 className="text-xl font-bold md:text-2xl lg:text-3xl text-pretty">
                            {title}
                        </h2>
                    )}
                    {subtitle && (
                        <p className="mt-4 lg:mt-5 px-0 lg:px-8 text-base md:text-lg text-text-color-60 text-pretty">
                            {subtitle}
                        </p>
                    )}
                </div>
                <dl
                    className={twJoin(
                        'max-w-4xl mx-auto mt-10 lg:mt-14',
                        with_border ? 'space-y-6' : 'space-y-10'
                    )}
                >
                    {items.map((item, index) => (
                        <div
                            key={index}
                            className={twJoin(
                                'flex flex-col group',
                                with_border &&
                                    'border border-neutral-200 p-6 rounded-xl bg-text-color-0'
                            )}
                            onClick={() => {
                                // open open a new one, auto close others
                                setOpenState((prev) =>
                                    prev.map((state, i) => (i === index ? !state : false))
                                );
                            }}
                            role="button"
                        >
                            <dt
                                className={twJoin(
                                    'flex items-start justify-between text-base md:text-lg font-semibold'
                                )}
                            >
                                <h3 className="text-heading-color/90">{item.title}</h3>
                                <span className="flex items-center">
                                    {openState[index] ? (
                                        <HiMinus className="h-5 w-5 text-text-color/50 group-hover:text-text-color/80" />
                                    ) : (
                                        <HiPlus className="h-5 w-5 text-text-color/50 group-hover:text-text-color/80" />
                                    )}
                                </span>
                            </dt>
                            <dd
                                className={twJoin(
                                    'overflow-hidden',
                                    openState[index] ? 'max-h-screen' : 'max-h-0'
                                )}
                            >
                                <SafeHtml
                                    value={item.paragraphs}
                                    className="pt-4 text-sm md:text-base text-text-color [&>p+p]:mt-2"
                                />
                            </dd>
                        </div>
                    ))}
                </dl>
            </Container>
        );
    }
}
