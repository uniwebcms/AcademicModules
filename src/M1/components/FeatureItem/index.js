import React from 'react';
import { Icon, SafeHtml, Link, twJoin } from '@uniwebcms/module-sdk';
import { motion } from 'framer-motion';
import { MdArrowForward } from 'react-icons/md';

export default function FeatureItem(props) {
    const { block, index } = props;

    const { mode = 'basic', with_border = false, with_motion = false } = block.getBlockProperties();

    const MotionWrapper = with_motion
        ? ({ children }) => (
              <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
              >
                  {children}
              </motion.div>
          )
        : ({ children }) => children;

    if (mode === 'basic') {
        const { title, paragraphs, links } = block.getBlockContent();

        const link = links[0];

        return (
            <MotionWrapper>
                <div
                    className={twJoin(
                        'text-card-foreground shadow-sm backdrop-blur-sm',
                        with_border && 'rounded-lg border border-text-color/20 p-6'
                    )}
                >
                    <h3 className="text-lg font-medium mb-2">{title}</h3>
                    {paragraphs && (
                        <SafeHtml value={paragraphs} className={with_border ? 'text-sm' : ''} />
                    )}
                    {link && (
                        <Link to={link.href} className="block mt-4 pt-4">
                            <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input h-10 px-4 py-2 gap-2 border-none">
                                {link.label}
                                <MdArrowForward className="w-4 h-4 text-inherit" />
                            </button>
                        </Link>
                    )}
                </div>
            </MotionWrapper>
        );
    }

    if (mode === 'leading_icon') {
        const { title, paragraphs, links, icons } = block.getBlockContent();

        const [firstLink, secondLink] = links;
        const icon = icons[0];

        const titleOnly = !paragraphs.length && !links.length && !icons.length;

        if (titleOnly) {
            return (
                <MotionWrapper>
                    <div
                        className={twJoin(
                            'backdrop-blur-sm flex items-center gap-3',
                            with_border && 'rounded-lg border border-text-color/20 p-4'
                        )}
                    >
                        {titleOnly ? (
                            <div className="w-8 h-8 rounded-lg bg-icon-color/10 flex items-center justify-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-icon-color"></div>
                            </div>
                        ) : null}
                        <h3 className="truncate">{title}</h3>
                    </div>
                </MotionWrapper>
            );
        } else {
            const [, firstLinkIcon, secondLinkIcon] = icons;
            return (
                <MotionWrapper>
                    <div
                        className={twJoin(
                            'backdrop-blur-sm flex items-start gap-4',
                            with_border && 'rounded-lg border border-text-color/20 p-6'
                        )}
                    >
                        <div className="mt-1">
                            <div className="w-10 h-10 rounded-lg bg-icon-color/10 flex items-center justify-center">
                                <Icon icon={icon} className="w-5 h-5"></Icon>
                            </div>
                        </div>
                        <div className="flex-1">
                            <h3 className="font-medium text-lg mb-2">{title}</h3>
                            {paragraphs.length && <SafeHtml value={paragraphs} className="mb-4" />}
                            <div className="flex items-center justify-between">
                                {firstLink && (
                                    <Link to={firstLink.href} className="group">
                                        <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-10 px-4 py-2 gap-2 -ml-2 relative z-20">
                                            {firstLink.label}
                                            {firstLinkIcon && (
                                                <Icon
                                                    icon={firstLinkIcon}
                                                    className="w-4 h-4 text-inherit group-hover:translate-x-0.5 transition-transform"
                                                />
                                            )}
                                        </button>
                                    </Link>
                                )}
                                {secondLink && (
                                    <Link
                                        to={firstLink.href}
                                        className="group flex items-center gap-2 text-sm"
                                    >
                                        {secondLinkIcon && (
                                            <Icon
                                                icon={secondLinkIcon}
                                                className="w-4 h-4 text-inherit hover:text-inherit"
                                            />
                                        )}
                                        <span>{secondLink.label}</span>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </MotionWrapper>
            );
        }
    }

    if (mode === 'rich') {
        const { icons, title, paragraphs, links } = block.getBlockContent();

        const icon = icons[0];

        const [firstLink, secondLink] = links;

        return (
            <div className="flex-1 flex flex-col max-w-md mx-auto w-full">
                {icon && <Icon icon={icon} className="w-16 h-16 mx-auto" />}
                {title && <h3 className="mt-4 text-lg font-bold truncate">{title}</h3>}
                {paragraphs && (
                    <SafeHtml
                        value={paragraphs}
                        className="mt-1 text-base !leading-snug line-clamp-2 h-12"
                    />
                )}
                <div className="flex items-center justify-between mt-4">
                    {firstLink && (
                        <Link
                            to={firstLink.href}
                            className="bg-btn-color text-btn-text-color flex items-center justify-center py-1 px-3 rounded-3xl max-w-[48%]"
                        >
                            <span className="truncate text-sm">{firstLink.label}</span>
                        </Link>
                    )}
                    {secondLink && (
                        <Link
                            to={secondLink.href}
                            className="text-btn-alt-text-color flex items-center justify-center max-w-[48%] hover:underline"
                        >
                            <span className="truncate text-sm">{secondLink.label}</span>
                            &nbsp;&rarr;
                        </Link>
                    )}
                </div>
            </div>
        );
    }

    if (mode === 'catching_card') {
        const { title, icons, paragraphs, links } = block.getBlockContent();

        const [titleIcon, linkIcon] = icons;
        const link = links[0];

        const Wrapper = link ? Link : 'div';
        const wrapperProps = link ? { to: link.href } : {};

        return (
            <Wrapper {...wrapperProps} className="group relative cursor-pointer">
                <div
                    className={twJoin(
                        'absolute -inset-px bg-gradient-to-r rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm'
                        // 'from-slate-300 to-slate-300'
                    )}
                ></div>
                <div
                    className={twJoin(
                        'relative h-full rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300'
                    )}
                >
                    <div className="h-12 mb-6">
                        <div className={twJoin('inline-flex p-3 rounded-xl', 'bg-icon-color/10')}>
                            <Icon icon={titleIcon} className="w-6 h-6" />
                        </div>
                    </div>
                    <h3 className={twJoin('text-xl font-semibold mb-4')}>{title}</h3>
                    <SafeHtml value={paragraphs} className={twJoin('mb-6 text-text-color')} />
                    {link && (
                        <div className={twJoin('inline-flex items-center font-medium')}>
                            {link.label}
                            <Icon
                                icon={linkIcon}
                                className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform text-inherit"
                            />
                        </div>
                    )}
                </div>
            </Wrapper>
        );
    }

    if (mode === 'bullet_list') {
        const { icons, title, lists } = block.getBlockContent();
        const [titleIcon, bulletIcon] = icons;

        const features = lists[0]?.map((item) => item.paragraphs[0])?.filter(Boolean) || [];

        return (
            <div
                className={twJoin(
                    with_border &&
                        'h-full p-8 rounded-xl shadow-lg border border-text-color/10 hover:shadow-xl transition-shadow'
                )}
            >
                {titleIcon && (
                    <div className="mb-6">
                        <Icon icon={titleIcon} className="w-12 h-12" />
                    </div>
                )}
                <h3 className="text-2xl font-bold mb-4">{title}</h3>
                <ul className="space-y-4">
                    {features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                            <Icon icon={bulletIcon} className="w-5 h-5 mr-2 flex-shrink-0 mt-1" />
                            <span>{feature}</span>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}
