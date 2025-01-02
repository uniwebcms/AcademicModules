import React from 'react';
import { Icon, SafeHtml, Link, twJoin } from '@uniwebcms/module-sdk';

export default function FeatureItem(props) {
    const { block } = props;

    const items = block.getBlockItems();

    const { mode = 'basic' } = block.getBlockProperties(); // loose, iconic, standard

    if (!items.length) return null;

    if (mode === 'rich') {
        return items.map((item, index) => {
            const { icons, title, paragraphs, links } = item;

            const icon = icons[0];

            const [firstLink, secondLink] = links;

            return (
                <div className="flex-1 flex flex-col max-w-md mx-auto w-full" key={index}>
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
        });
    }

    if (mode === 'catching_card') {
        const iconStyle = [
            'bg-blue-50 text-blue-500',
            'bg-orange-50 text-orange-500',
            'bg-green-50 text-green-500',
        ];

        const linkStyle = [
            'text-blue-500 hover:text-blue-600',
            'text-orange-500 hover:text-orange-600',
            'text-green-500 hover:text-green-600',
        ];

        return items.map((item, index) => {
            const { title, icons, paragraphs, links } = item;

            const [titleIcon, linkIcon] = icons;
            const link = links[0];

            const Wrapper = link ? Link : 'div';
            const wrapperProps = link ? { to: link.href } : {};

            return (
                <Wrapper
                    key={index}
                    {...wrapperProps}
                    className="group relative cursor-pointer"
                    role={link ? 'link' : 'button'}
                >
                    <div
                        className={twJoin(
                            'absolute -inset-px bg-gradient-to-r rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm',
                            'from-slate-300 to-slate-300'
                        )}
                    ></div>
                    <div
                        className={twJoin(
                            'relative h-full rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300',
                            'bg-white'
                        )}
                    >
                        <div className="h-12 mb-6">
                            <div
                                className={twJoin(
                                    'inline-flex p-3 rounded-xl',
                                    iconStyle[index % iconStyle.length]
                                )}
                            >
                                <Icon icon={titleIcon} className="w-6 h-6 text-inherit" />
                            </div>
                        </div>
                        <h3 className={twJoin('text-xl font-semibold mb-4', 'text-black')}>
                            {title}
                        </h3>
                        <SafeHtml value={paragraphs} className={twJoin('mb-6', 'text-gray-600')} />
                        {link && (
                            <div
                                className={twJoin(
                                    'inline-flex items-center font-medium',
                                    linkStyle[index % linkStyle.length]
                                )}
                            >
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
        });
    }
}
