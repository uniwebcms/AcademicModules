import React from 'react';
import Container from '../_utils/Container';
import { twJoin, Media, Link, SafeHtml, getPageProfile } from '@uniwebcms/module-sdk';
import { FaPlay } from 'react-icons/fa';

export default function FeatureSpotlight(props) {
    const { block } = props;
    const { title, paragraphs, links } = block.getBlockContent();
    const firstLink = links[0];

    const items = block.getBlockItems();

    const { layout = '', colorTone = '' } = block.getBlockProperties();

    let itemIconActiveClass, itemIconClass, linkClass, mediaIndicatorClass;

    switch (colorTone) {
        case 'primary':
            itemIconActiveClass = 'bg-primary-500 border-primary-500 text-bg-color';
            itemIconClass = 'bg-bg-color border-primary-500 text-primary-500';
            linkClass = 'bg-primary-500 text-bg-color';
            mediaIndicatorClass = 'bg-primary-500';
            break;
        case 'secondary':
            itemIconActiveClass = 'bg-secondary-500 border-secondary-500 text-bg-color';
            itemIconClass = 'bg-bg-color border-secondary-500 text-secondary-500';
            linkClass = 'bg-secondary-500 text-bg-color';
            mediaIndicatorClass = 'bg-secondary-500';
            break;
        case 'accent':
            itemIconActiveClass = 'bg-accent-500 border-accent-500 text-bg-color';
            itemIconClass = 'bg-bg-color border-accent-500 text-accent-500';
            linkClass = 'bg-accent-500 text-bg-color';
            mediaIndicatorClass = 'bg-accent-500';
            break;
        default:
            itemIconActiveClass = 'bg-blue-500 border-blue-500 text-white';
            itemIconClass = 'bg-white border-blue-500 text-blue-500';
            linkClass = 'bg-blue-500 text-white';
            mediaIndicatorClass = 'bg-blue-500';
            break;
    }

    const [currentIndex, setCurrentIndex] = React.useState(0);

    const currentMedia =
        items[currentIndex]?.videos?.[0] ||
        items[currentIndex]?.images?.[0] ||
        items[currentIndex]?.banner ||
        null;
    const currentItemLink = items[currentIndex]?.links?.[0];

    return (
        <Container
            py="lg"
            className={twJoin(
                'flex flex-col lg:flex-row items-center justify-between gap-y-8 lg:gap-y-0 max-w-8xl mx-auto',
                layout === 'reverse' ? 'lg:flex-row-reverse' : ''
            )}
        >
            {/* content */}
            <div
                className={twJoin(
                    'flex flex-col w-full lg:w-[44%]'
                    // layout === 'reverse' ? 'lg:w-[52%]' : 'lg:w-[44%]'
                )}
            >
                <h2 className="text-2xl font-medium md:text-3xl lg:text-4xl text-left text-pretty">
                    {title}
                </h2>
                {paragraphs.length && (
                    <SafeHtml
                        value={paragraphs}
                        className="mt-2 lg:mt-4 text-base md:text-lg lg:text-xl font-light text-left"
                    />
                )}
                {items.length && (
                    <div className="mt-6 lg:mt-10 pl-0 lg:pl-14 space-y-3">
                        {items.map((item, index) => {
                            const { title } = item;

                            if (!title) return null;

                            return (
                                <div
                                    key={index}
                                    className="flex items-center space-x-2 cursor-pointer transform origin-left hover:scale-105 transition-transform duration-150"
                                    onClick={() => {
                                        setCurrentIndex(index);
                                    }}
                                >
                                    <span
                                        className={twJoin(
                                            'w-5 h-5 rounded-full p-[5px] border',
                                            currentIndex === index
                                                ? itemIconActiveClass
                                                : itemIconClass
                                        )}
                                    >
                                        <FaPlay className="w-full h-full text-inherit" />
                                    </span>
                                    <h3 className="text-base md:text-lg">{title}</h3>
                                </div>
                            );
                        })}
                    </div>
                )}
                {firstLink && (
                    <Link
                        to={firstLink.href}
                        className={twJoin(
                            'mt-8 lg:mt-12 mx-auto py-3 px-6 rounded-3xl hover:shadow-lg',
                            linkClass
                        )}
                    >
                        <span className="text-lg md:text-xl font-medium">{firstLink.label}</span>
                    </Link>
                )}
            </div>
            {/* media */}
            <div
                className={twJoin(
                    'py-6 w-full lg:w-[52%]',
                    layout === 'reverse' ? 'pr-0 lg:pr-8' : 'pl-0 lg:pl-8'
                )}
            >
                {currentMedia && (
                    <Media
                        profile={getPageProfile()}
                        media={currentMedia}
                        className="rounded-xl shadow-lg"
                        style={{ paddingBottom: '60%' }}
                    />
                )}
                <div
                    className={twJoin(
                        'relative mt-4 w-full flex items-center lg:justify-center',
                        layout === 'reverse' ? 'justify-start' : 'justify-end'
                    )}
                >
                    {items.length > 1
                        ? Array.from({ length: items.length }).map((_, index) => (
                              <span
                                  key={index}
                                  className={twJoin(
                                      'w-4 h-4 rounded-full cursor-pointer mx-2',
                                      currentIndex === index
                                          ? mediaIndicatorClass
                                          : 'bg-text-color-40'
                                  )}
                                  onClick={() => {
                                      setCurrentIndex(index);
                                  }}
                              />
                          ))
                        : null}
                    {currentItemLink && (
                        <div
                            className={twJoin(
                                'absolute top-[calc(-50%+2px)]',
                                layout === 'reverse' ? 'right-4' : 'left-4'
                            )}
                        >
                            <Link
                                to={currentItemLink.href}
                                className="text-text-color-50 text-base hover:underline hover:text-text-color-70"
                            >
                                {currentItemLink.label}
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </Container>
    );
}
