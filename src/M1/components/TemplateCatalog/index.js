import React, { useState, useEffect, useRef } from 'react';
import Container from '../_utils/Container';
import { twJoin, website } from '@uniwebcms/module-sdk';
import { HiSearch, HiArrowRight } from 'react-icons/hi';
import { TbSortDescending } from 'react-icons/tb';
import { LuChevronDown, LuListFilter } from 'react-icons/lu';
import VirtualGrid from './components/VirtualGrid';
import { normalizeData } from './helper';
import Modal from './components/Modal';

const Information = ({ data, ...props }) => {
    const {
        text,
        modalTriggerText,
        modalTitle,
        modalSubtitle,
        modalExamples,
        modalTagEndnote,
        modalButton,
    } = data;

    // check if modalTriggerText is substring of the text, and split the text into parts, [before, modalTriggerText, after]
    const parts = text.split(modalTriggerText);

    const className = 'text-sm 2xl:text-base text-neutral-600';

    if (parts.length > 1) {
        return (
            <div className={className}>
                {parts[0]}
                <Modal
                    triggerClassName={'cursor-pointer underline hover:text-neutral-700'}
                    triggerText={modalTriggerText}
                    title={modalTitle}
                    subtitle={modalSubtitle}
                    examples={modalExamples}
                    tagEndnote={modalTagEndnote}
                    button={modalButton}
                    {...props}
                />
                {parts[1]}
            </div>
        );
    }

    return <p className={className}>{text}</p>;
};

const FilterBar = ({ name, options, filters, onChange, filled = true }) => {
    const activeClassFilled = 'border-neutral-900 bg-neutral-900 text-neutral-50';
    const activeClass = 'border-neutral-300 bg-neutral-50 text-neutral-900';

    const inactiveClassFilled = 'border-transparent text-neutral-800 hover:bg-neutral-200';
    const inactiveClass = 'border-neutral-200 text-neutral-800 hover:bg-neutral-100';

    return (
        <div className="w-fit">
            <div
                className={twJoin(
                    'flex justify-center border rounded-full p-1 gap-1 xl:gap-2',
                    filled ? 'border-neutral-300' : 'border-transparent bg-neutral-200'
                )}
            >
                {options.map((option, index) => {
                    const active = filters[name] === option.value;

                    return (
                        <div
                            key={index}
                            onClick={() => onChange(name, option.value)}
                            className={twJoin(
                                'text-sm font-medium px-3 2xl:px-4 py-1 2xl:py-1.5 rounded-full border cursor-pointer',
                                active
                                    ? filled
                                        ? activeClassFilled
                                        : activeClass
                                    : filled
                                    ? inactiveClassFilled
                                    : inactiveClass
                            )}
                        >
                            {option.label}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const SortMenu = ({ data, filters, onChange }) => {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);
    const triggerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            // todo: should exclude the dropdown trigger itself
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                triggerRef.current &&
                !triggerRef.current.contains(event.target)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const options = data.options.map((opt, index) => {
        const { label, value } = opt;
        const checked = filters['sort'] === value;

        return (
            <label className="flex items-center gap-3 text-sm px-2 cursor-pointer" key={index}>
                <input
                    type="radio"
                    value={value}
                    checked={checked}
                    onChange={() => onChange(value)}
                />
                <span>{label}</span>
            </label>
        );
    });

    return (
        <div className="relative w-fit">
            <div
                ref={triggerRef}
                className="flex items-center whitespace-nowrap rounded-full text-sm font-medium p-[9px] sm:px-3 sm:py-[9px] 2xl:px-4 2xl:py-2.5 border border-neutral-300 cursor-pointer max-w-48 md:max-w-60 lg:max-w-64 group gap-x-2"
                onClick={() => setOpen(!open)}
            >
                <TbSortDescending
                    className={twJoin(
                        'w-5 h-5 sm:w-4 sm:h-4 text-inherit flex-shrink-0',
                        open ? 'opacity-90' : 'opacity-60 md:opacity-70 group-hover:opacity-100'
                    )}
                />
                <span
                    className={twJoin(
                        'hidden md:block',
                        open ? 'opacity-80 ' : 'opacity-60 group-hover:opacity-100'
                    )}
                >
                    {data.title}:
                </span>
                {filters['sort'] && (
                    <span className="truncate hidden sm:block">
                        {data.options.find((opt) => opt.value === filters['sort'])?.label}
                    </span>
                )}
                <LuChevronDown
                    className={twJoin(
                        'w-4 h-4 text-inherit hidden sm:block flex-shrink-0',
                        open ? 'rotate-180 opacity-90' : 'opacity-70 group-hover:opacity-100'
                    )}
                />
            </div>
            <div className="absolute top-12 right-0 z-50">
                {open && (
                    <div
                        ref={dropdownRef}
                        role="radiogroup"
                        className="bg-neutral-50 border border-neutral-300 rounded-md space-y-3 px-2 py-3 w-44"
                    >
                        {options}
                    </div>
                )}
            </div>
        </div>
    );
};

const FilterMenu = ({ data, filters, onChange }) => {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);
    const triggerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            // todo: should exclude the dropdown trigger itself
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                triggerRef.current &&
                !triggerRef.current.contains(event.target)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const options = data.map((filter) => {
        const { name, title, options } = filter;

        return (
            <div key={name} className="px-2">
                <p className="text-sm font-medium text-neutral-600 mb-2">{title}</p>
                <div className="mt-1">
                    {options.map((opt) => {
                        const { label, value } = opt;
                        const checked = filters[name] === value;

                        return (
                            <label
                                className="flex items-center gap-x-3 text-sm mb-3 cursor-pointer"
                                key={label}
                            >
                                <input
                                    type="radio"
                                    value={value}
                                    checked={checked}
                                    onChange={() => onChange(name, value)}
                                />
                                <span>{label}</span>
                            </label>
                        );
                    })}
                </div>
            </div>
        );
    });

    const { searchText, sort, ...actualFilters } = filters;

    const filterState = Object.entries(actualFilters).map(([key, value]) => {
        const cate = data.find((filter) => filter.name === key);
        const val = cate?.options.find((opt) => opt.value === value)?.label;

        return val ? `${cate.title}: ${val}` : '';
    });

    return (
        <div className="relative w-fit">
            <div
                ref={triggerRef}
                className="flex items-center whitespace-nowrap rounded-full text-sm font-medium p-[9px] sm:px-3 py-[9px] 2xl:px-4 2xl:py-2.5 border border-neutral-300 cursor-pointer max-w-48 md:max-w-60 lg:max-w-64 group gap-x-2"
                onClick={() => setOpen(!open)}
            >
                <LuListFilter
                    className={twJoin(
                        'w-5 h-5 sm:w-4 sm:h-4 text-inherit flex-shrink-0',
                        open ? 'opacity-90' : 'opacity-60 md:opacity-70 group-hover:opacity-100'
                    )}
                />
                <span
                    className={twJoin(
                        'hidden md:block',
                        open ? 'opacity-80 ' : 'opacity-60 group-hover:opacity-100'
                    )}
                >
                    {website.localize({
                        en: 'Filter by:',
                        fr: 'Filtrer par:',
                        es: 'Filtrar por:',
                        zh: '筛选：',
                    })}
                </span>
                <span className="truncate hidden sm:block">{filterState.join(', ')}</span>
                <LuChevronDown
                    className={twJoin(
                        'w-4 h-4 text-inherit hidden sm:block flex-shrink-0',
                        open ? 'rotate-180 opacity-90' : 'opacity-70 group-hover:opacity-100'
                    )}
                />
            </div>
            <div className="absolute top-12 right-0 z-50">
                {open && (
                    <div
                        ref={dropdownRef}
                        role="radiogroup"
                        className="bg-neutral-50 border border-neutral-300 rounded-md space-y-3 px-2 py-3 w-64"
                    >
                        {options}
                    </div>
                )}
            </div>
        </div>
    );
};

const initFilters = (config) => {
    const { filters, sort } = config;

    const filterObj = { searchText: '' };

    if (filters) {
        filters.forEach((filter) => {
            if (filter.options && filter.default) {
                filterObj[filter.name] = filter.default;
            }
        });
    }

    if (sort) {
        if (sort.default) {
            filterObj['sort'] = sort.default;
        }
    }

    return filterObj;
};

export default function TemplateCatalog(props) {
    const { block, input } = props;

    const { title, links, properties } = block.getBlockContent();

    const [filters, setFilters] = useState(initFilters(properties));
    const [sectionStyle, setSectionStyle] = useState({});

    const { useLocation } = website.getRoutingComponents();
    const location = useLocation();

    // get the category and libraryType from the URL if they exist, set them to the filters
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const category = searchParams.get('category');
        const libraryType = searchParams.get('libraryType');

        if (category || libraryType) {
            setFilters((prevFilters) => {
                const updatedFilters = { ...prevFilters };

                if (category && prevFilters.category !== category) {
                    updatedFilters.category = category;
                }

                if (libraryType && prevFilters.libraryType !== libraryType) {
                    updatedFilters.libraryType = libraryType;
                }

                return updatedFilters;
            });

            // Clean up the URL to remove 'category' and 'libraryType' params (without causing a page reload)
            searchParams.delete('category');
            searchParams.delete('libraryType');

            const newUrl =
                window.location.pathname +
                (searchParams.toString() ? '?' + searchParams.toString() : '') +
                window.location.hash;

            window.history.replaceState(null, '', newUrl);
        }
    }, [location.search]);

    // this is for the Dialog (Modal) to use all css variables from the section
    useEffect(() => {
        const sourceElement = document.getElementById(`Section${block.id}`);

        if (sourceElement) {
            const styleObject = {};

            // Loop through inline styles explicitly set on the element
            const inlineStyles = sourceElement.style;

            for (let i = 0; i < inlineStyles.length; i++) {
                const key = inlineStyles[i];
                const value = inlineStyles.getPropertyValue(key);

                styleObject[key] = value;
            }

            // Store the styles in the state
            setSectionStyle(styleObject);
        }
    }, [block.id]);

    const templates = normalizeData(input, properties);

    const { search_box, info, filters: filterInfo = [], sort } = properties;

    const updateSearchText = (text) => {
        setFilters((prevFilters) => ({ ...prevFilters, searchText: text }));
    };

    const updateFilters = (key, newValue) => {
        setFilters((prevFilters) => ({ ...prevFilters, [key]: newValue }));
    };

    const updateSort = (newSort) => {
        setFilters((prevFilters) => ({ ...prevFilters, sort: newSort }));
    };

    const mainTitle = <h2 className="text-2xl xl:text-3xl font-semibold text-nowrap">{title}</h2>;

    const searchBox = search_box ? (
        <div className="relative border border-neutral-300 rounded-full text-sm xl:text-base px-2.5 lg:px-3 py-[9px] xl:px-5 xl:py-2.5 w-56 lg:w-60 xl:w-72 flex-shrink-0">
            <HiSearch className="absolute top-1/2 left-3 lg:left-4 transform -translate-y-1/2 text-neutral-400 w-5 h-5 xl:w-6 xl:h-6" />
            <input
                type="text"
                placeholder={search_box.placeholder}
                className="pl-7 lg:pl-8 w-full focus:outline-none placeholder:text-neutral-500"
                value={filters.searchText}
                onChange={(e) => updateSearchText(e.target.value)}
            ></input>
        </div>
    ) : null;

    const information = info ? (
        <Information data={info} theme={block.themeName} style={sectionStyle} />
    ) : null;

    const filterBar = filterInfo.map((filter, index) => (
        <FilterBar
            key={index}
            {...filter}
            filled={index % 2 === 0}
            filters={filters}
            onChange={updateFilters}
        />
    ));

    const filterMenu = <FilterMenu data={filterInfo} filters={filters} onChange={updateFilters} />;

    const sortMenu = sort ? <SortMenu data={sort} filters={filters} onChange={updateSort} /> : null;

    const titleLink = (
        <div
            className="flex items-center space-x-1 text-lg font-medium group text-neutral-600/95 hover:text-neutral-700 cursor-pointer"
            onClick={() => {
                const appDomain = uniweb.getAppDomain();
                fetch(`${appDomain}/temp_resource.php`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json', // Specify content type
                    },
                    body: JSON.stringify({
                        action: 'store',
                        data: {
                            templateSite: '_blank',
                        },
                    }), // Convert data object to JSON string
                })
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        return response.json(); // Parse the JSON response
                    })
                    .then((data) => {
                        window.location.replace(data);
                    })
                    .catch((error) => {
                        console.error('Error:', error); // Handle any errors
                    });
            }}
        >
            <span className="text-nowrap">{links[0].label}</span>
            <HiArrowRight className="w-5 h-5 text-inherit group-hover:translate-x-1 transition-transform flex-shrink-0" />
        </div>
    );

    return (
        <Container className="max-w-9xl mx-auto">
            {/* header, search, info_modal and link in a bar */}
            <>
                <div className="hidden xl:flex justify-between items-center mb-8 gap-x-6">
                    {mainTitle}
                    {searchBox}
                    {information}
                    {titleLink}
                </div>
                <div className="hidden lg:flex flex-col gap-y-6 xl:hidden mb-12">
                    <div className="flex justify-between items-center gap-x-6">
                        {mainTitle}
                        {information}
                        {titleLink}
                    </div>
                </div>
                <div className="flex flex-col gap-y-3 lg:hidden mb-8">
                    <div className="flex justify-between items-center gap-x-6">
                        {mainTitle}
                        {titleLink}
                    </div>
                    <div>{information}</div>
                </div>
            </>
            {/* filters and sorts */}
            <>
                <div className="hidden xl:flex justify-between items-center mb-10 gap-x-8">
                    <div className="flex justify-between items-center gap-y-4 gap-x-8">
                        {filterBar}
                    </div>
                    {sortMenu}
                </div>
                <div className="flex xl:hidden justify-between items-start mb-10 gap-x-4">
                    {searchBox}
                    <div className="flex items-center gap-x-4">
                        {filterMenu}
                        {sortMenu}
                    </div>
                </div>
            </>
            {/* grid */}
            <VirtualGrid data={templates} filters={filters} />
        </Container>
    );
}
