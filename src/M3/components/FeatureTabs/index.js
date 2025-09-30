import React, { useState } from 'react';
import Container from '../_utils/Container';
import { twJoin } from '@uniwebcms/module-sdk';
import { Icon } from '@uniwebcms/core-components';

export default function FeatureTabs(props) {
    const { block } = props;

    const { title, subtitle } = block.getBlockContent();

    const items = block.getBlockItems();

    const [activeIndex, setActiveIndex] = useState(0);

    const handleTabClick = (index) => {
        setActiveIndex(index);
    };

    const activeItem = items[activeIndex];
    const activeFeatures =
        activeItem.lists[0]?.map((item) => ({
            icon: item.icons?.[0],
            text: item.paragraphs?.[0],
        })) || [];

    return (
        <Container py="md" className="max-w-8xl mx-auto">
            <div className="text-center">
                {title && <h2 className="text-3xl lg:text-4xl font-bold mb-4 lg:mb-5">{title}</h2>}
                {subtitle && (
                    <p className="text-lg lg:text-lg max-w-4xl mx-auto text-pretty text-heading-color-70">
                        {subtitle}
                    </p>
                )}
            </div>
            <div className="mt-10">
                <ul className="w-full flex flex-wrap gap-6 justify-center">
                    {items.map((item, index) => (
                        <li
                            key={index}
                            className={twJoin(
                                'w-40 text-center flex flex-col items-center cursor-pointer p-4 border rounded-lg gap-2',
                                activeIndex === index
                                    ? 'border-accent-200 bg-accent-100 text-accent-700'
                                    : 'border-neutral-200 bg-neutral-100 text-neutral-800 hover:text-neutral-900 hover:bg-neutral-200'
                            )}
                            onClick={() => handleTabClick(index)}
                        >
                            <Icon
                                icon={item.icons[0]}
                                className="w-6 h-6 text-inherit opacity-85"
                            />
                            <p className="text-sm font-medium">{item.title}</p>
                        </li>
                    ))}
                </ul>
                <div className="p-6 xl:p-8 mt-10 max-w-4xl mx-auto bg-neutral-100 rounded-lg border border-neutral-200">
                    <div className="flex items-center gap-3">
                        <Icon
                            icon={activeItem.icons[0]}
                            className="w-6 h-6 lg:w-7 lg:h-7 text-heading-color-70"
                        />
                        <h3 className="text-xl lg:text-2xl font-bold text-heading-color-90">
                            {activeItem.title}
                        </h3>
                    </div>
                    <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {activeFeatures.map((feature, index) => (
                            <li key={index} className="flex items-center">
                                <div className="w-6 h-6 p-1 rounded-full bg-accent-100 flex-shrink-0">
                                    <Icon
                                        icon={feature.icon}
                                        className="w-full h-full text-accent-700"
                                    />
                                </div>
                                <span className="ml-3 text-sm lg:text-base">{feature.text}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </Container>
    );
}
