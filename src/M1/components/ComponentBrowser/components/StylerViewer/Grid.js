import React, { useState, useRef, useEffect, Fragment } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { HiSearch, HiX } from 'react-icons/hi';
import { website } from '@uniwebcms/module-sdk';
import { HiChevronRight } from 'react-icons/hi2';

const CategoryBar = ({ categories, activeCategory, setActiveCategory }) => {
    categories = Array.from(categories) || [];
    categories = ['all', ...categories];

    const containerRef = useRef(null);
    const itemsRef = useRef([]);
    const [visibleCount, setVisibleCount] = useState(categories.length);

    useEffect(() => {
        const calculateVisibleItems = () => {
            if (!containerRef.current || itemsRef.current.length === 0) return;

            const containerWidth = containerRef.current.offsetWidth;

            const moreButtonWidth = 120; // Estimated width for "More" button
            let totalWidth = 0;
            let visibleItems = 0;

            // Calculate how many items can fit
            for (let i = 0; i < itemsRef.current.length; i++) {
                const item = itemsRef.current[i];
                if (!item) continue;

                totalWidth += item.offsetWidth + 8; // 8px for gap

                if (totalWidth + moreButtonWidth > containerWidth) {
                    break;
                }
                visibleItems++;
            }

            setVisibleCount(Math.max(1, visibleItems)); // Always show at least 1 item
        };

        // Run calculation once when component mounts
        calculateVisibleItems();
    }, []); // Only run once on mount

    const dropdownItems = categories.slice(visibleCount);

    const isDropdownItemSelected = () => {
        return dropdownItems.some((item) => item === activeCategory);
    };

    const makeLabel = (key) => {
        return key
            .split('_')
            .map((word) => word[0].toUpperCase() + word.slice(1))
            .join(' ');
    };

    return (
        <div className={`w-[calc(100%-240px)] ml-4 flex items-center gap-2`} ref={containerRef}>
            {categories.map((category, index) => {
                if (index >= visibleCount) return null;

                return (
                    <div
                        key={category}
                        ref={(el) => (itemsRef.current[index] = el)}
                        onClick={() => setActiveCategory(category)}
                        className={`py-2 px-[14px] text-[13px] cursor-pointer h-[30px] flex items-center border rounded-lg text-xs capitalize transition-colors flex-shrink-0 ${
                            activeCategory === category
                                ? 'bg-neutral-600 text-white'
                                : 'bg-white hover:bg-neutral-200 text-neutral-700'
                        }`}
                    >
                        {makeLabel(category)}
                    </div>
                );
            })}
            {dropdownItems.length > 0 && (
                <Popover className={`relative`}>
                    {({ open }) => (
                        <>
                            <Popover.Button as="div" className={`flex`}>
                                <span className={`sr-only hidden`}>Open user menu</span>
                                <div
                                    className={`p-2 px-[14px] text-[13px] cursor-pointer h-[30px] flex items-center border rounded-lg text-sm transition-colors gap-1 flex-shrink-0 ${
                                        isDropdownItemSelected()
                                            ? 'bg-neutral-600 text-white'
                                            : 'bg-white hover:bg-neutral-200 text-neutral-700'
                                    }`}
                                >
                                    {isDropdownItemSelected()
                                        ? makeLabel(activeCategory)
                                        : website.localize({ en: 'More', fr: 'Plus' })}
                                    <HiChevronRight className={`w-4 h-4`} />
                                </div>
                            </Popover.Button>
                            <Transition as={Fragment} show={open}>
                                <Popover.Panel
                                    static
                                    className={`absolute top-full mt-2 right-0 w-32 bg-white rounded !shadow-xl border ring-1 ring-neutral-900 ring-opacity-5 font-normal text-sm text-neutral-900 divide-y divide-neutral-100 z-[999]`}
                                >
                                    <div className={`flex flex-col`}>
                                        {dropdownItems.map((category) => (
                                            <Popover.Button
                                                key={category}
                                                className={`py-2 px-3.5 bg-neutral-50 hover:bg-neutral-100 text-neutral-700 hover:text-neutral-900 cursor-pointer text-left truncate`}
                                                onClick={() => {
                                                    setActiveCategory(category);
                                                }}
                                                title={makeLabel(category)}
                                            >
                                                {makeLabel(category)}
                                            </Popover.Button>
                                        ))}
                                    </div>
                                </Popover.Panel>
                            </Transition>
                        </>
                    )}
                </Popover>
            )}
        </div>
    );
};

const ComponentItem = (props) => {
    let { title, image } = props;
    title = website.localize(title);

    let preview = null;

    if (image) {
        const { src } = image || {};

        preview = <img src={src} alt={title} className={`w-full h-full object-contain`} />;
    } else {
        preview = <p className={`font-bold text-neutral-900 px-4`}>{title}</p>;
    }

    return (
        <div
            className={`w-full h-[221px] overflow-hidden rounded-lg border border-neutral-300 flex flex-col shadow`}
        >
            <div
                className={`flex items-center justify-center w-full h-44 relative flex-shrink-0 overflow-hidden bg-neutral-200`}
            >
                {preview}
            </div>
            <div
                className={`flex-shrink-0 border-t p-3 text-sm font-medium text-neutral-800 truncate`}
                title={title}
            >
                {title}
            </div>
        </div>
    );
};

export default function Grid(props) {
    const { schema } = props;

    let components = Object.keys(schema)
        .filter((k) => k !== '_self')
        .sort();

    const categories = new Set(
        components
            .map((key) => schema[key].category || '')
            .filter(Boolean)
            .sort()
    );

    const [searchText, setSearchText] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');

    return (
        <div className="w-full h-full">
            <div className={`w-full flex items-center px-4 lg:px-6 pt-6`}>
                <div
                    className={`w-60 flex items-center justify-between border border-neutral-300 rounded-md pl-3 pr-2 py-1 text-xs`}
                >
                    <input
                        type="text"
                        className={`flex-1 outline-none text-neutral-700 bg-transparent`}
                        placeholder={website.localize({ en: 'Search', fr: 'Rechercher' })}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    {searchText ? (
                        <HiX
                            className={`w-5 h-5 text-neutral-400 hover:text-neutral-600 cursor-pointer flex-shrink-0`}
                            onClick={() => setSearchText('')}
                        />
                    ) : (
                        <HiSearch className={`w-5 h-5 text-neutral-400 flex-shrink-0`} />
                    )}
                </div>
                {categories.size > 0 && (
                    <CategoryBar {...{ categories, activeCategory, setActiveCategory }} />
                )}
            </div>
            <div
                className={`h-[calc(100%-66px)] w-full mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 lg:gap-5 px-4 lg:px-6 pt-2 pb-4 overflow-auto`}
            >
                {components
                    .filter((key) => {
                        let flag = true;
                        if (activeCategory === 'all') flag = true;
                        else flag = schema[key].category === activeCategory;

                        return searchText
                            ? flag &&
                                  website
                                      .localize(schema[key].title)
                                      .toLowerCase()
                                      .includes(searchText.toLocaleLowerCase())
                            : flag;
                    })
                    .map((key, i) => {
                        return <ComponentItem key={i} {...schema[key]} />;
                    })}
            </div>
        </div>
    );
}
