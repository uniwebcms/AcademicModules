import React from 'react';
import { getPageProfile, twJoin } from '@uniwebcms/module-sdk';
import { Icon, Image, SafeHtml } from '@uniwebcms/core-components';
import Container from '../_utils/Container';

export default function ContentHighlight(props) {
    const { block } = props;

    const { title, subtitle, lists, images, paragraphs, icons } = block.getBlockContent();

    const { image_position = 'right' } = block.getBlockProperties();

    const features =
        lists[0]?.map((item) => ({ icon: item.icons?.[0], text: item.paragraphs?.[0] })) || [];
    const image = images[0];

    const calloutText = paragraphs[0];
    const calloutIcon = icons[0];

    return (
        <Container
            py="md"
            className="max-w-8xl mx-auto grid gird-cols-1 md:grid-cols-2 items-center gap-8 lg:gap-12 xl:gap-16"
        >
            {/* Text Content */}
            <div className="w-full">
                <h2 className="text-2xl lg:text-3xl font-bold text-auto">{title}</h2>
                <p className="mt-3 text-base lg:text-lg text-heading-color-70">{subtitle}</p>
                <ul className="pl-4 mt-6 space-y-3 lg:space-y-4">
                    {features.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                            <div className="w-6 h-6 p-1 rounded-full bg-accent-50 flex-shrink-0">
                                <Icon
                                    icon={feature.icon}
                                    className="w-full h-full text-accent-600"
                                />
                            </div>
                            <span className="ml-3 text-sm lg:text-base">{feature.text}</span>
                        </li>
                    ))}
                </ul>

                {/* Callout */}
                <div className="mt-8 w-full bg-accent-50 text-accent-700 px-5 py-4 rounded-lg inline-flex items-center">
                    <Icon icon={calloutIcon} className="w-5 h-5 text-accent-500 flex-shrink-0" />
                    <span className="ml-2">
                        <SafeHtml value={calloutText} />
                    </span>
                </div>
            </div>

            {/* Image */}
            <div
                className={twJoin(
                    'w-full flex items-center justify-center aspect-square',
                    image_position === 'left' ? 'md:-order-1' : ''
                )}
            >
                <Image profile={getPageProfile()} {...image} />
            </div>
        </Container>
    );
}
