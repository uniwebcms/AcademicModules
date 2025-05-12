import React from 'react';
import { twJoin, Link, Icon } from '@uniwebcms/module-sdk';

export default function PricingTier(props) {
    const { block } = props;

    const { title } = block.getBlockContent();

    const items = block.getBlockItems();

    return (
        <div className="pt-[60px] pb-10 px-5">
            <div className="text-center">
                <h2 className="text-[42px] md:text-[48px] xl:text-[72px] leading-[118%] md:leading-[112%]">
                    {title}
                </h2>
            </div>
            <div className="grid lg:grid-cols-3 mt-8 sm:mt-14 gap-4 sm:gap-6">
                {items.map((item, index) => {
                    const { pretitle, title, subtitle, description, links, lists, buttons } = item;

                    const link = links[0];
                    const list = lists[0];

                    const badge = buttons?.[0];

                    return (
                        <div
                            key={index}
                            className={twJoin(
                                'relative h-full p-6 rounded-[12px] text-left font-light',
                                badge ? 'border-accent-600 border-2' : 'border border-text-color-30'
                            )}
                        >
                            {badge && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                    <span className="h-6 bg-accent-600 text-bg-color px-3 rounded-full text-sm font-medium flex items-center justify-center">
                                        {badge.content}
                                    </span>
                                </div>
                            )}
                            <div className="space-y-1">
                                <p className="text-2xl">{pretitle}</p>
                                <p className="text-4xl font-bold">{title}</p>
                                <p className="text-sm text-text-color-90">{subtitle}</p>
                            </div>
                            <div className="mt-6">
                                <p className="text-lg">{description}</p>
                                <Link
                                    to={link.href}
                                    className={twJoin(
                                        'my-5 block text-center p-4 text-lg hover:bg-btn-hover-color hover:text-btn-hover-text-color shadow-md rounded-lg hover:shadow-lg transition duration-300 ease-in-out',
                                        badge
                                            ? 'bg-btn-alt-color text-bg-color'
                                            : 'bg-btn-color text-btn-text-color'
                                    )}
                                >
                                    <span>{link.label}</span>
                                </Link>
                                <ul className="space-y-3">
                                    {list.map((list, f_index) => {
                                        const feature = list.paragraphs[0];
                                        const icon = list.icons[0];

                                        return (
                                            <li key={f_index} className="flex items-start gap-2">
                                                <Icon
                                                    icon={icon}
                                                    className={twJoin(
                                                        'w-4 h-4 text-text-color-70 flex-shrink-0 pt-1.5'
                                                    )}
                                                />
                                                <span>{feature}</span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
