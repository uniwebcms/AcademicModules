import React, { useState, useRef, useEffect, Fragment } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { HiSearch, HiX } from 'react-icons/hi';
import { website, twJoin } from '@uniwebcms/module-sdk';
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

const PresetImageSlideshow = ({ isHovered, images, alt }) => {
    const [currentImage, setCurrentImage] = useState(images[0] || '');
    const [activeIndex, setActiveIndex] = useState(0);
    const intervalRef = useRef(null);
    const indexRef = useRef(1);
    const imageCount = images.length;

    useEffect(() => {
        if (imageCount === 0) return;

        if (isHovered && imageCount > 1) {
            intervalRef.current = setInterval(() => {
                setCurrentImage(images[indexRef.current]);
                setActiveIndex(indexRef.current);
                indexRef.current = (indexRef.current + 1) % imageCount;
            }, 1000);
        } else {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            indexRef.current = 1;
            setCurrentImage(images[0]);
            setActiveIndex(0);
        }

        return () => clearInterval(intervalRef.current);
    }, [isHovered, images]);

    const progressPercentage = imageCount > 0 ? ((activeIndex + 1) / imageCount) * 100 : 0;

    return (
        <>
            <img src={currentImage} alt={alt} className={`w-full h-full object-contain`} />;
            {isHovered && imageCount > 1 && (
                <div
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        height: 4,
                        width: '100%',
                        background: 'rgb(31 41 55 / 0.3)',
                    }}
                >
                    <div
                        style={{
                            height: '100%',
                            width: `${progressPercentage}%`,
                            background: 'rgba(255, 255, 255, 0.9)',
                            transition: 'width 0.3s ease-in-out',
                        }}
                    />
                </div>
            )}
        </>
    );
};

const ComponentItem = (props) => {
    const [hovered, setHovered] = useState(false);

    let {
        info: { title, image, presets },
        setActiveComponent,
    } = props;
    title = website.localize(title);

    let preview = null;

    if (image) {
        const { src } = image || {};

        if (presets && presets.length > 0) {
            preview = (
                <PresetImageSlideshow
                    alt={title}
                    isHovered={hovered}
                    images={presets.map((p) => p.image.src)}
                />
            );
        } else {
            preview = <img src={src} alt={title} className={`w-full h-full object-contain`} />;
        }
    } else {
        preview = <p className={`font-bold text-neutral-900 px-4`}>{title}</p>;
    }

    return (
        <div
            className={twJoin(
                'w-full h-[221px] overflow-hidden rounded-lg border border-neutral-300 flex flex-col shadow',
                'transition-transform duration-150 hover:scale-105 cursor-pointer hover:shadow-lg'
            )}
            onClick={() => {
                setActiveComponent(props.info);
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
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

const PresetViewer = (props) => {
    const { component } = props;

    const { title, description, images, presets } = component;

    return (
        <div className="flex flex-col w-full">
            <p className="text-lg lg:text-xl font-bold text-neutral-950">
                {website.localize(title)}
            </p>
            <p className="mt-2 text-sm lg:text-base text-neutral-700">
                {website.localize(description)}
            </p>
            <div className="mt-8 space-y-8">
                {presets?.map((preset, index) => {
                    const label = website.localize(preset.label);

                    const parsedProperties = findProperties(component, preset);

                    return (
                        <div key={index} className="flex flex-col-reverse xl:flex-row gap-y-4">
                            <img
                                src={preset.image.src}
                                alt={label}
                                className="flex-shrink-0 xl:max-w-[768px] w-full xl:w-2/3 aspect-[16/9] object-contain rounded-lg border border-neutral-300"
                            />
                            <div className="flex-grow w-full xl:w-1/3 pl-0 xl:pl-8 2xl:pl-12">
                                <p className="font-medium text-lg">{label}</p>
                                <ul className="gap-2 mt-2 flex flex-wrap flex-row xl:flex-col">
                                    {Object.entries(parsedProperties).map(
                                        ([property, value], idx) => (
                                            <li
                                                key={idx}
                                                className="border border-neutral-300 bg-neutral-100 rounded-lg px-2 py-1.5 text-sm w-fit"
                                            >
                                                <span className="text-xs uppercase text-neutral-500">
                                                    {property}:
                                                </span>{' '}
                                                <span className="text-neutral-800">{value}</span>
                                            </li>
                                        )
                                    )}
                                </ul>
                            </div>
                        </div>
                    );
                })}
                {images?.map((image, index) => {
                    return (
                        <div key={index}>
                            <img
                                src={image.src}
                                className="mx-auto w-full max-w-[768px] aspect-[16/9] object-contain rounded-lg border border-neutral-300"
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default function Grid(props) {
    const { schema } = props;

    const [activeComponent, setActiveComponent] = useState(null);

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
        <div className="w-full h-full relative overflow-hidden">
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
                className={`max-h-[calc(100%-74px)] w-full mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:xl:grid-cols-4 gap-3 lg:gap-5 px-4 lg:px-6 pt-2 pb-4 overflow-auto`}
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
                        return (
                            <ComponentItem
                                key={i}
                                info={schema[key]}
                                setActiveComponent={setActiveComponent}
                            />
                        );
                    })}
            </div>
            {/* presets viewer */}
            <>
                <div
                    className={twJoin(
                        'absolute inset-0 bg-black/50 z-10',
                        activeComponent ? 'block' : 'hidden'
                    )}
                    onClick={() => {
                        if (activeComponent) setActiveComponent(null);
                    }}
                />
                <div
                    className={twJoin(
                        'absolute right-4 z-30 cursor-pointer transition-all duration-300 ease-in-out',
                        activeComponent ? 'top-[calc(30%+16px)]' : 'top-full'
                    )}
                    onClick={() => setActiveComponent(null)}
                >
                    <HiX className="w-6 h-6 text-neutral-500 hover:text-neutral-800" />
                </div>
                <div
                    className={twJoin(
                        'absolute inset-x-0 bg-neutral-50 z-20 px-6 pt-4 pb-5 overflow-auto transition-all duration-300 ease-in-out',
                        activeComponent ? 'top-[30%] h-[70%]' : 'top-full h-0'
                    )}
                >
                    {activeComponent && <PresetViewer component={activeComponent} />}
                </div>
            </>
        </div>
    );
}

const findProperties = (component, preset) => {
    return Object.keys(preset.properties).reduce((acc, key) => {
        const targetProperty = component.properties?.[key];
        if (!targetProperty) return acc;

        const localizedLabel = website.localize(targetProperty.label);

        let propertyValue = preset.properties[key];

        switch (targetProperty.type) {
            case 'boolean':
                propertyValue = website.localize({
                    en: propertyValue ? 'Yes' : 'No',
                    fr: propertyValue ? 'Oui' : 'Non',
                    es: propertyValue ? 'Sí' : 'No',
                    zh: propertyValue ? '是' : '否',
                });
                break;
            case 'string':
                if (targetProperty.enum?.length) {
                    // If the property has an enum, find the label for the value
                    const enumItem = targetProperty.enum.find(
                        (item) => item.value === propertyValue
                    );
                    if (enumItem) {
                        propertyValue = website.localize(enumItem.label);
                    } else {
                        propertyValue = website.localize(propertyValue);
                    }
                }
                break;
            default:
                // For other types, we can keep the original value
                break;
        }

        acc[localizedLabel] = propertyValue;
        return acc;
    }, {});
};
