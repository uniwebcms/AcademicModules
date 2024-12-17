import React from 'react';
import Container from '../_utils/Container';
import { HiCheck } from 'react-icons/hi';
import { SafeHtml, Icon, Link } from '@uniwebcms/module-sdk';
import { GoArrowRight } from 'react-icons/go';

const PlanBox = (props) => {
    const { title, subtitle, links, lists, icons, paragraphs } = props;

    const features = lists[0]?.map((item) => item.paragraphs[0]);

    // const solutions =
    //     icons.length && links.length && icons.length === links.length
    //         ? icons.map((icon, index) => {
    //               return {
    //                   icon,
    //                   link: links[index],
    //               };
    //           })
    //         : null;
    const solutions =
        icons.length && paragraphs.length && icons.length === paragraphs.length
            ? icons.map((icon, index) => {
                  return {
                      icon,
                      text: paragraphs[index],
                  };
              })
            : null;

    const actionLink = links[0] && !solutions ? links[0] : null;

    return (
        <div className="w-full rounded-md shadow-lg p-6 lg:p-8 flex flex-col">
            {title && <h3 className="text-lg md:text-xl lg:text-2xl font-bold">{title}</h3>}
            {subtitle && (
                <p className="mt-1 text-base text-text-color-50 font-medium">{subtitle}</p>
            )}
            <div className="flex-grow">
                {features && (
                    <ul role="list" className="mt-8 space-y-3">
                        {features.map((feature, index) => (
                            <li key={index} className="flex gap-x-3">
                                <HiCheck
                                    aria-hidden="true"
                                    className="h-6 w-5 flex-none text-green-600"
                                />
                                <SafeHtml
                                    value={feature}
                                    className="text-sm lg:text-base text-text-color-60"
                                />
                            </li>
                        ))}
                    </ul>
                )}
                {solutions && (
                    <ul role="list" className="mt-8 lg:mt-4 h-full flex flex-col justify-evenly">
                        {solutions.map((solution, index) => (
                            <div
                                key={index}
                                className="flex items-center py-3 rounded-md"
                                // className="flex items-center justify-between gap-x-3 group hover:bg-text-color/10 -mx-3 px-3 py-3 rounded-md"
                            >
                                <div className="flex items-center gap-x-3">
                                    <Icon
                                        icon={solution.icon}
                                        className="h-6 w-6 flex-none text-primary-600"
                                    />
                                    <SafeHtml
                                        value={solution.text}
                                        className="text-base lg:text-lg text-text-color-80"
                                        // className="text-base lg:text-lg font-medium text-text-color-70 group-hover:text-text-color-90"
                                    ></SafeHtml>
                                </div>
                                {/* <GoArrowRight className="h-6 w-6 text-text-color-60 group-hover:text-primary-600" /> */}
                            </div>
                        ))}
                    </ul>
                )}
            </div>
            {actionLink && (
                <Link
                    to={actionLink.href}
                    className="mt-10 px-6 py-2 text-sm lg:text-base font-medium text-white bg-primary-600 hover:bg-primary-500 rounded-md text-center"
                >
                    {actionLink.label}
                </Link>
            )}
            {/* {paragraphs.length ? (
                <SafeHtml
                    value={paragraphs}
                    className="mt-2 text-sm text-text-color-40 text-center"
                />
            ) : null} */}
        </div>
    );
};

export default function HeroPricing(props) {
    const { block } = props;
    const { pretitle, title, subtitle } = block.getBlockContent();

    const items = block.getBlockItems();

    return (
        <Container px="none">
            <div className="px-6 md:px-8 lg:px-16 xl:px-24 max-w-4xl mx-auto">
                {pretitle && (
                    <p className="mb-4 lg:mb-5 text-base md:text-lg text-primary-600 text-center">
                        {pretitle}
                    </p>
                )}
                {title && (
                    <h1 className="text-3xl font-semibold md:text-4xl lg:text-5xl text-center tracking-wide text-pretty">
                        {title}
                    </h1>
                )}
                {subtitle && (
                    <h2 className="mt-4 lg:mt-6 px-0 lg:px-8 text-base md:text-lg lg:text-xl text-text-color-60 text-center tracking-wide text-pretty">
                        {subtitle}
                    </h2>
                )}
            </div>
            {items.length ? (
                <div className="mt-12 sm:mt-16 lg:mt-20 px-6 md:px-8 lg:px-16 xl:px-24 max-w-8xl mx-auto flex flex-col lg:flex-row gap-6 lg:gap-10">
                    {items.map((item, index) => (
                        <PlanBox key={index} {...item} />
                    ))}
                </div>
            ) : null}
        </Container>
    );
}
