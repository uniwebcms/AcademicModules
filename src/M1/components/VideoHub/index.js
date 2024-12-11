import React from 'react';
import Container from '../_utils/Container';
import { Link, Image, useBlockInputFilterState } from '@uniwebcms/module-sdk';
import { HiX } from 'react-icons/hi';

export default function VideoHub(props) {
    const { block, input, website } = props;

    const { title, subtitle } = block.getBlockContent();

    const [filter, setFilter] = useBlockInputFilterState(block);

    const { filtered: videos } = filter;

    const searchText = filter.selection._search || '';

    return (
        <Container className="max-w-8xl mx-auto">
            {title && <h2 className="text-2xl font-semibold md:text-3xl lg:text-4xl">{title}</h2>}
            {subtitle && <p className="mt-4 lg:mt-6 text-lg md:text-xl lg:text-2xl">{subtitle}</p>}
            <div className="mt-8 lg:mt-10 space-y-8 lg:space-y-10">
                {/* search, filer and sort */}
                <div className="relative max-w-xl mx-auto">
                    <input
                        type="text"
                        value={searchText}
                        placeholder={website.localize({
                            en: 'Search videos',
                            fr: 'Rechercher des vidéos',
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring focus:ring-primary-500"
                        onChange={(e) => setFilter({ _search: e.target.value })}
                    />
                    {searchText && (
                        <button
                            className="absolute right-0 top-0 mt-2.5 mr-2 !bg-transparent"
                            onClick={() => setFilter({ _search: '' })}
                        >
                            <HiX className="w-6 h-6 text-text-color-50 hover:text-text-color" />
                        </button>
                    )}
                </div>
                {/* grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 xl:gap-6">
                    {videos.map((video, index) => {
                        const { title } = video.getBasicInfo();

                        return (
                            <Link
                                key={index}
                                to={input.makeHref(video)}
                                className="flex flex-col overflow-hidden group hover:scale-105 transition-transform transform"
                            >
                                <div className="w-full aspect-video rounded-xl overflow-hidden">
                                    <Image
                                        profile={video}
                                        type="banner"
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                                <div className="flex-grow mt-3 mb-5">
                                    <h3 className="text-sm lg:text-base font-medium line-clamp-2 text-pretty !leading-snug group-hover:underline">
                                        {title}
                                    </h3>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </Container>
    );
}
