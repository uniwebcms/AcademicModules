import React from 'react';
import { Image } from '@uniwebcms/module-sdk';

export default function LogoCarousel(props) {
    const { block, page } = props;

    const { title, images } = block.getBlockContent();

    const carousel = images.map((image, index) => {
        return (
            <li key={index} className="">
                <Image
                    profile={page.getPageProfile()}
                    {...image}
                    className="h-8 w-auto object-cover max-w-[120px] lg:max-w-[200px]"
                />
            </li>
        );
    });

    return (
        <div className="overflow-hidden pb-16">
            <h2 className="text-base sm:text-lg lg:text-2xl mt-4 md:mt-12 mb-4 sm:mb-6 md:mb-10 text-center px-5">
                {title}
            </h2>

            <div className="flex gap-16 md:gap-24 lg:w-[600%] xl:w-[440%]">
                <ul
                    className="flex items-center gap-12 sm:gap-20 xl:gap-24 bg-transparent h-[75px] animate-[infinite-scroll]"
                    style={{
                        animation: '80s linear 0s infinite normal none running infinite-scroll',
                    }}
                >
                    {carousel}
                </ul>
                <ul
                    className="flex items-center gap-12 sm:gap-20 xl:gap-24 bg-transparent h-[75px] animate-[infinite-scroll]"
                    style={{
                        animation: '80s linear 0s infinite normal none running infinite-scroll',
                    }}
                >
                    {carousel}
                </ul>
            </div>
        </div>
    );
}
