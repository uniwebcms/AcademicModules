import React from 'react';
import Container from '../_utils/Container';
import { Image, getPageProfile, Link, twJoin, SafeHtml } from '@uniwebcms/module-sdk';
import { MdArrowForward } from 'react-icons/md';

const Card = (props) => {
    const { banner, pretitle, title, subtitle, paragraphs, links } = props;

    const link = links[0];

    if (banner) {
        const Wrapper = link ? Link : 'div';
        const wrapperProps = link ? { to: link.href } : {};

        return (
            <Wrapper
                className={twJoin(
                    'flex flex-col rounded-lg overflow-hidden shadow-lg',
                    link && 'hover:shadow-xl'
                )}
                {...wrapperProps}
            >
                {banner && (
                    <div className="relative h-48">
                        <Image
                            profile={getPageProfile()}
                            {...banner}
                            className="object-cover w-full h-full"
                        />
                    </div>
                )}
                <div className="p-4">
                    {pretitle && <p className="text-xs lg:text-sm text-primary-600">{pretitle}</p>}
                    {title && <h3 className="text-lg lg:text-xl font-bold mb-2 mt-1">{title}</h3>}
                    {paragraphs && (
                        <SafeHtml
                            value={paragraphs}
                            className="text-sm lg:text-base font-light text-text-color-70 line-clamp-5"
                        />
                    )}
                </div>
            </Wrapper>
        );
    } else {
        return (
            <div className="flex flex-col rounded-lg border text-card-foreground shadow-sm bg-text-color/10 border-text-color/20 p-6">
                <div className="flex-grow mb-6">
                    <h3 className="text-2xl font-semibold leading-none tracking-tight mb-2.5">
                        {title}
                    </h3>
                    {subtitle && <p className="text-base text-heading-color-90 mb-4">{subtitle}</p>}
                    {paragraphs.length && <SafeHtml value={paragraphs} className="text-base" />}
                </div>
                {link && (
                    <Link to={link.href} className="block">
                        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input h-10 px-4 py-2 group">
                            {link.label}
                            <MdArrowForward className="w-4 h-4 text-inherit transition-transform group-hover:translate-x-1" />
                        </button>
                    </Link>
                )}
            </div>
        );
    }
};

export default function ContentTeaser(props) {
    const { block } = props;

    const { title, subtitle, links } = block.getBlockContent();
    const items = block.getBlockItems();

    const { card_size = 'md' } = block.getBlockProperties();

    const link = links[0];

    return (
        <Container py={'xl'}>
            <div
                className={twJoin(
                    'mx-auto',
                    card_size === 'md' && 'max-w-8xl',
                    card_size === 'lg' && 'max-w-7xl'
                )}
            >
                <div
                    className={twJoin(
                        'flex items-center',
                        link ? 'justify-between' : 'justify-center'
                    )}
                >
                    <div>
                        {title && (
                            <h2 className="text-xl font-medium md:text-2xl lg:text-3xl mb-2">
                                {title}
                            </h2>
                        )}
                        {subtitle && (
                            <p className="mb-6 lg:mb-8 text-base lg:text-lg">{subtitle}</p>
                        )}
                    </div>
                    {link && (
                        <Link to={link.href} className="hover:underline text-sm lg:text-base">
                            {link.label}
                            &nbsp;&rarr;
                        </Link>
                    )}
                </div>
                {items.length ? (
                    <div
                        className={twJoin(
                            'mt-4 sm:mt-6 lg:mt-10 grid grid-cols-1 gap-4',
                            card_size === 'md' && 'md:grid-cols-2 lg:grid-cols-3 lg:gap-6',
                            card_size === 'lg' && 'lg:grid-cols-2 lg:gap-10'
                        )}
                    >
                        {items.map((item, index) => (
                            <Card key={index} {...item} />
                        ))}
                    </div>
                ) : null}
            </div>
        </Container>
    );
}
