import React from 'react';
import Container from '../_utils/Container';
import { getPageProfile } from '@uniwebcms/module-sdk';
import { Image, Icon, SafeHtml, Link } from '@uniwebcms/core-components';
import { motion } from 'framer-motion';

export default function MotionFeature(props) {
    const { block } = props;

    const { title, subtitle, paragraphs, links, quotes } = block.getBlockContent();

    const { sub_feature_style = 'grid_cards' } = block.getBlockProperties();

    const items = block.getBlockItems();

    const link = links[0];
    const quote = quotes[0]?.paragraphs?.[0];

    return (
        <Container px="lg">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div
                // className="text-center lg:text-left"
                >
                    <h2 className="text-3xl font-semibold max-w-3xl mx-auto lg:mx-0">{title}</h2>
                    {subtitle && (
                        <SafeHtml
                            value={subtitle}
                            className="text-lg leading-relaxed mt-6 max-w-3xl mx-auto lg:mx-0"
                        />
                    )}
                    {paragraphs.length > 0 && <SafeHtml value={paragraphs} className="mt-6" />}

                    {quote && (
                        <aside className="mt-8 border-l-4 border-secondary-500 pl-6">
                            <p className="text-lg font-medium italic text-heading-color/90">
                                {quote}
                            </p>
                        </aside>
                    )}
                    {link && (
                        <div className="mt-8">
                            <Button link={link} />
                        </div>
                    )}
                </div>

                {sub_feature_style === 'grid_cards' && (
                    <div className="">
                        <GridCards items={items} />
                    </div>
                )}
                {sub_feature_style === 'sliding_blocks' && (
                    <div className="relative h-72">
                        <SlidingBlocks items={items} />
                    </div>
                )}
                {sub_feature_style === 'growing_cards' && (
                    <div className="relative h-72">
                        <GrowingCards items={items} />
                    </div>
                )}
            </div>
        </Container>
    );
}

const GridCards = ({ items }) => {
    return (
        <div className="grid grid-cols-2 gap-4 lg:gap-6">
            {items.map((item, index) => {
                const { banner, title, links } = item;
                const link = links[0];
                const Wrapper = link ? Link : 'div';
                const wrapperProps = link
                    ? {
                          href: link.href,
                      }
                    : {};

                return (
                    <Wrapper {...wrapperProps} key={index}>
                        <motion.div
                            className="bg-text-color-0 rounded-xl shadow-lg border border-text-color/20 overflow-hidden"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ scale: 1.05, shadow: 'var(--tw-shadow-xl)' }}
                        >
                            {banner && (
                                <Image
                                    {...banner}
                                    profile={getPageProfile()}
                                    className="w-full h-24 sm:h-32 object-cover"
                                />
                            )}
                            <h4 className="p-4 text-center font-semibold text-sm sm:text-base">
                                {title}
                            </h4>
                        </motion.div>
                    </Wrapper>
                );
            })}
        </div>
    );
};

const SlidingBlocks = ({ items }) => {
    const [firstItem, secondItem] = items;

    return (
        <>
            {firstItem && (
                <motion.div
                    className="absolute top-0 left-0 bg-text-color/5 p-6 rounded-xl shadow-xl border border-text-color/20 w-full lg:w-3/4 transform -rotate-1 origin-top-left"
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <p className="text-sm font-mono text-text-color/80">{firstItem.title}</p>
                    <div className="mt-3 space-y-2">
                        <div className="bg-text-color-0 p-3 rounded-lg border border-text-color/30">
                            {firstItem.paragraphs[0]}
                        </div>
                        <div className="bg-text-color-0 p-3 rounded-lg border border-text-color/30">
                            {firstItem.paragraphs[1]}
                        </div>
                        <div className="bg-text-color-0 p-3 rounded-lg border border-text-color/30">
                            {firstItem.paragraphs[2]}
                        </div>
                    </div>
                </motion.div>
            )}

            {secondItem && (
                <motion.div
                    className={
                        'absolute bottom-0 right-0 bg-text-color-0 p-6 rounded-xl shadow-2xl border-4 border-secondary-500 w-full lg:w-3/4 transform rotate-2 origin-bottom-right'
                    }
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <p className="text-sm font-mono text-text-color/80">{secondItem.title}</p>
                    <div className="mt-3 space-y-2">
                        <div
                            className={
                                'bg-primary-500/10 p-3 rounded-lg border border-secondary-500 text-heading-color/90 font-semibold'
                            }
                        >
                            {secondItem.paragraphs[0]}
                        </div>
                    </div>
                </motion.div>
            )}
        </>
    );
};

const GrowingCards = ({ items }) => {
    const [firstItem, secondItem] = items;

    return (
        <>
            {firstItem && (
                <motion.div
                    className={
                        'absolute top-[-10px] left-0 bg-secondary-50 p-6 rounded-xl shadow-xl border-2 border-secondary-500 w-full lg:w-3/4 transform -rotate-1 origin-top-left flex flex-col items-center justify-center'
                    }
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    {firstItem.icons[0] && (
                        <Icon
                            icon={firstItem.icons[0]}
                            className="w-12 h-12 [&_svg]:text-secondary-500"
                        />
                    )}
                    <p className={'text-xl font-semibold mt-4 text-heading-color/90'}>
                        {firstItem.title}
                    </p>
                    <p className="text-sm text-text-color/90 mt-1">{firstItem.subtitle}</p>
                </motion.div>
            )}

            <motion.div
                className="absolute bottom-[-10px] right-0 bg-primary-50 p-6 rounded-xl shadow-2xl border-2 border-primary-500 w-full lg:w-3/4 transform rotate-2 origin-bottom-right flex flex-col items-center justify-center"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: 0.3 }}
            >
                {secondItem.icons[0] && (
                    <Icon
                        icon={secondItem.icons[0]}
                        className="w-12 h-12 [&_svg]:text-primary-500"
                    />
                )}

                <p className={'text-xl font-semibold mt-4 text-heading-color/90'}>
                    {secondItem.title}
                </p>
                <p className="text-sm text-text-color/90 mt-1">{secondItem.subtitle}</p>
            </motion.div>
        </>
    );
};

const Button = ({ link }) => {
    return (
        <Link
            to={link.href}
            className="inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all transform hover:-translate-y-px hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 bg-secondary-500 text-text-color-0 hover:bg-secondary-600 px-6 py-3 text-base mt-8"
        >
            {link.label}
        </Link>
    );
};
