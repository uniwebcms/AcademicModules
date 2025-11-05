import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Container from '../_utils/Container';
import { twJoin, website } from '@uniwebcms/module-sdk';
import { Link } from '@uniwebcms/core-components';
import { HiSearch, HiArrowRight } from 'react-icons/hi';
import { TbSortDescending } from 'react-icons/tb';
import { LuChevronDown, LuLayers2, LuCrown, LuGem } from 'react-icons/lu';
import { IoPricetagsOutline } from 'react-icons/io5';
import VirtualGrid from './components/VirtualGrid';
import { normalizeData } from './helper';
import Modal from './components/Modal';
import debounce from 'lodash.debounce';
import BeatLoader from 'react-spinners/BeatLoader';
import { motion } from 'framer-motion';

const icons = {
    layer: LuLayers2,
    crown: LuCrown,
    gem: LuGem,
    'price-tag': IoPricetagsOutline,
};

const FilterBar = ({ name, options, filters, onChange }) => {
    return (
        <div className="max-w-full w-fit">
            <div
                className={twJoin(
                    'flex border rounded-full p-1 gap-1 w-full overflow-x-auto no-scrollbar hover:shadow-sm border-neutral-300'
                )}
            >
                {options.map((option, index) => {
                    const active = filters[name] === option.value;

                    return (
                        <div
                            key={index}
                            onClick={() => onChange(name, option.value)}
                            className={twJoin(
                                'text-xs md:text-sm font-medium px-2 md:px-3 2xl:px-4 py-1 2xl:py-1.5 rounded-full border cursor-pointer',
                                active
                                    ? 'border-neutral-900 bg-neutral-900 text-neutral-50'
                                    : 'border-transparent text-neutral-800 hover:bg-neutral-200'
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
                <span className="text-neutral-700">{label}</span>
            </label>
        );
    });

    return (
        <div className="relative w-fit ml-2 md:ml-4 lg:ml-6 xl:ml-8">
            <div
                ref={triggerRef}
                className="flex items-center whitespace-nowrap rounded-full text-sm font-medium p-[9px] sm:px-3 sm:py-[9px] 2xl:px-4 2xl:py-2.5 border border-neutral-300 cursor-pointer max-w-48 md:max-w-60 lg:max-w-64 group gap-x-2 hover:shadow-sm"
                onClick={() => setOpen(!open)}
            >
                <TbSortDescending
                    className={twJoin(
                        'w-4 h-4 md:w-5 md:h-5 lg:w-4 lg:h-4 text-inherit flex-shrink-0',
                        open ? 'opacity-90' : 'opacity-70 group-hover:opacity-100'
                    )}
                />
                {filters['sort'] && (
                    <span
                        className={twJoin(
                            'truncate hidden lg:block',
                            open ? 'opacity-100' : 'opacity-80 group-hover:opacity-100'
                        )}
                    >
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
                        className="bg-neutral-50 border border-neutral-300 rounded-xl space-y-3 px-2 py-3 w-44 shadow-xl"
                    >
                        {options}
                    </div>
                )}
            </div>
        </div>
    );
};

const Information = ({ data, modalProps }) => {
    const { title, description, examples, endnote, buttons } = data;

    return (
        <Modal
            title={title}
            description={description}
            examples={examples}
            tagEndnote={endnote}
            button={buttons}
            {...modalProps}
        />
    );
};

const FilterMenu = ({ data, filters, onChange, modalProps }) => {
    const [open, setOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const dropdownRef = useRef(null);
    const triggerRef = useRef(null);

    const modalInfo = data.options.find((opt) => opt.info.type === 'dialog')?.info;

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
        const { icon, label, value, info } = opt;

        const Icon = icons[icon] || 'div';

        const active = filters[data.name] === value;

        return (
            <div
                className={twJoin(
                    'flex items-center justify-between gap-3 px-3 py-2 cursor-pointer',
                    active ? 'bg-neutral-200' : 'hover:bg-neutral-200'
                )}
                key={index}
                onClick={() => {
                    onChange(data.name, value);
                    setOpen(false);
                }}
            >
                <div className="flex items-center gap-2">
                    <Icon
                        className={twJoin(
                            'w-4 h-4',
                            active ? 'text-neutral-600' : 'text-neutral-500'
                        )}
                    />
                    <span
                        className={twJoin(
                            'text-sm font-medium',
                            active ? 'text-neutral-800' : 'text-neutral-700'
                        )}
                    >
                        {label}
                    </span>
                </div>
                {info.type === 'dialog' && (
                    <span
                        className={twJoin(
                            'text-xs cursor-pointer underline italic',
                            active
                                ? 'text-neutral-600 hover:text-neutral-700'
                                : 'text-neutral-500 hover:text-neutral-600'
                        )}
                        onClick={(e) => {
                            e.stopPropagation();
                            setModalOpen(true);
                        }}
                    >
                        {info.trigger}
                    </span>
                )}
                {info.type === 'text' && (
                    <span
                        className={twJoin(
                            'text-xs font-medium',
                            active ? 'text-neutral-600' : 'text-neutral-500'
                        )}
                    >
                        {info.value}
                    </span>
                )}
            </div>
        );
    });

    const { searchText, sort, ...actualFilters } = filters;

    const activeValue = actualFilters[data.name];
    const activeOption = data.options.find((opt) => opt.value === activeValue);
    const ActiveIcon = icons[activeOption?.icon] || 'div';
    const activeLabel = activeOption?.label;

    const isActive = activeValue && activeValue !== 'all';

    return (
        <>
            <div className="relative w-fit ml-auto">
                <div
                    ref={triggerRef}
                    className={twJoin(
                        'flex items-center whitespace-nowrap rounded-full text-sm font-medium p-[9px] sm:px-3 py-[9px] 2xl:px-4 2xl:py-2.5 border cursor-pointer max-w-48 md:max-w-60 lg:max-w-64 group gap-x-2 hover:shadow-sm',
                        isActive
                            ? 'bg-neutral-900 border-neutral-900 text-neutral-50'
                            : ' border-neutral-300 text-neutral-950'
                    )}
                    onClick={() => setOpen(!open)}
                >
                    <ActiveIcon
                        className={twJoin(
                            'w-4 h-4 md:w-5 md:h-5 lg:w-4 lg:h-4 text-inherit flex-shrink-0',
                            !isActive
                                ? open
                                    ? 'opacity-90'
                                    : 'opacity-70 group-hover:opacity-100'
                                : ''
                        )}
                    />
                    <span
                        className={twJoin(
                            'hidden lg:block',
                            !isActive
                                ? open
                                    ? 'opacity-100'
                                    : 'opacity-80 group-hover:opacity-100'
                                : ''
                        )}
                    >
                        {activeLabel}
                    </span>
                    <LuChevronDown
                        className={twJoin(
                            'w-4 h-4 text-inherit hidden sm:block flex-shrink-0',
                            open ? 'rotate-180 opacity-90' : 'opacity-70 group-hover:opacity-100'
                        )}
                    />
                </div>
                <div className="absolute top-12 right-0 lg:left-0 lg:right-auto z-50">
                    {open && (
                        <div
                            ref={dropdownRef}
                            role="radiogroup"
                            className="bg-neutral-50 border border-neutral-300 rounded-xl py-1 w-60 shadow-xl overflow-hidden"
                        >
                            {options}
                        </div>
                    )}
                </div>
            </div>

            {/* Information Modal */}
            {modalInfo && (
                <Information
                    data={modalInfo}
                    modalProps={{
                        open: modalOpen,
                        updateOpen: setModalOpen,
                        ...modalProps,
                    }}
                />
            )}
        </>
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

const SEARCH_DEBOUNCE_MS = 300;

export default function TemplateBrowser(props) {
    const { block, input } = props;
    const { title, properties, links } = block.getBlockContent();
    const { search_box, filters: filterInfo = [], sort } = properties;
    const inlineFilter = filterInfo.find((filter) => filter.type === 'inline');
    const menuFilter = filterInfo.find((filter) => filter.type === 'menu');
    const templates = normalizeData(input, properties);

    const filterKeys = useMemo(() => {
        const keys = new Set(['searchText']);

        filterInfo.forEach((filter) => {
            if (filter?.name) {
                keys.add(filter.name);
            }
        });

        if (sort) {
            keys.add('sort');
        }

        return Array.from(keys);
    }, [filterInfo, sort]);

    const defaultFilters = useMemo(() => initFilters(properties), [properties]);

    const { useLocation, useNavigate } = website.getRoutingComponents();
    const location = useLocation();
    const navigate = useNavigate();

    const [filters, setFilters] = useState(defaultFilters);
    const [sectionStyle, setSectionStyle] = useState({});

    const updateQueryParams = useCallback(
        (updates) => {
            const searchParams = new URLSearchParams(location.search);
            let hasChanges = false;

            Object.entries(updates).forEach(([key, rawValue]) => {
                const value = rawValue == null ? rawValue : String(rawValue);
                const defaultValue =
                    defaultFilters[key] == null ? defaultFilters[key] : String(defaultFilters[key]);

                const shouldRemove =
                    value === undefined ||
                    value === null ||
                    value === '' ||
                    (defaultValue !== undefined && defaultValue !== null && value === defaultValue);

                if (shouldRemove) {
                    if (searchParams.has(key)) {
                        searchParams.delete(key);
                        hasChanges = true;
                    }
                } else if (searchParams.get(key) !== value) {
                    searchParams.set(key, value);
                    hasChanges = true;
                }
            });

            if (!hasChanges) {
                return;
            }

            const searchString = searchParams.toString();
            const nextPath = `${location.pathname}${searchString ? `?${searchString}` : ''}${
                location.hash || ''
            }`;

            navigate(nextPath, { replace: true });
        },
        [defaultFilters, location.hash, location.pathname, location.search, navigate]
    );

    const updateSearchText = (text) => {
        updateQueryParams({ searchText: text || '' });
    };

    const updateFilters = (key, newValue) => {
        updateQueryParams({ [key]: newValue });
    };

    const updateSort = (newSort) => {
        updateQueryParams({ sort: newSort });
    };

    // sync filter state with URL search params
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const nextFilters = { ...defaultFilters };

        filterKeys.forEach((key) => {
            if (!(key in nextFilters)) {
                nextFilters[key] = '';
            }

            const paramValue = searchParams.get(key);

            if (paramValue !== null) {
                nextFilters[key] = paramValue;
            }
        });

        setFilters((prevFilters) => {
            const allKeys = new Set([...Object.keys(prevFilters), ...Object.keys(nextFilters)]);

            for (const key of allKeys) {
                if (prevFilters[key] !== nextFilters[key]) {
                    return nextFilters;
                }
            }

            return prevFilters;
        });
    }, [location.search, defaultFilters, filterKeys]);

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

    const mainTitle = (
        <h2 className="text-xl lg:text-2xl xl:text-3xl font-semibold text-nowrap lg:mr-8 w-44 lg:w-fit">
            {title}
        </h2>
    );

    const searchBox = search_box ? (
        <div className="relative border border-neutral-300 rounded-full text-xs lg:text-sm xl:text-base px-2.5 lg:px-3 py-[9px] xl:px-5 xl:py-2.5 w-56 lg:w-60 xl:w-72 flex-shrink-0 hover:shadow-sm">
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

    const filterBar = inlineFilter ? (
        <FilterBar {...inlineFilter} filters={filters} onChange={updateFilters} />
    ) : null;

    const filterMenu = (
        <FilterMenu
            data={menuFilter}
            filters={filters}
            onChange={updateFilters}
            modalProps={{ theme: block.themeName, style: sectionStyle }}
        />
    );

    const sortMenu = sort ? <SortMenu data={sort} filters={filters} onChange={updateSort} /> : null;

    const titleLink = links[0] ? (
        <Link
            to={links[0].href}
            className="flex items-center space-x-1 text-base lg:text-lg font-medium group text-neutral-600/95 hover:text-neutral-700 cursor-pointer ml-6 lg:ml-auto w-44 lg:w-fit justify-end lg:justify-normal"
        >
            <span className="text-nowrap">{links[0].label}</span>
            <HiArrowRight className="w-5 h-5 text-inherit group-hover:translate-x-1 transition-transform flex-shrink-0" />
        </Link>
    ) : null;

    return (
        <Container className="max-w-9xl mx-auto">
            {/* title, search and link in a bar */}
            <div className="flex justify-between lg:justify-normal items-center mb-8">
                {mainTitle}
                <div className="hidden md:block">{searchBox}</div>
                {/* {skipLink} */}
                {titleLink}
            </div>

            {/* filters and sorts */}
            <>
                <div className="hidden md:flex items-center mb-10">
                    {filterBar}
                    {filterMenu}
                    {sortMenu}
                </div>
                <div className="block md:hidden mb-6">
                    <div>{filterBar}</div>
                    <div className="flex items-center mt-4">
                        {searchBox}
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

TemplateBrowser.Loader = () => {
    return (
        <motion.div
            className="flex flex-col items-center justify-center min-h-[400px] text-center p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
        >
            <BeatLoader color="rgb(37 99 235)" size={12} margin={4} />
            <motion.p
                className="mt-4 text-neutral-700 text-sm sm:text-base"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
            >
                {website.localize({
                    en: 'Loading templates. This should only take a moment.',
                    fr: 'Chargement des modèles. Cela ne devrait prendre qu’un instant.',
                    es: 'Cargando plantillas. Esto debería tomar solo un momento.',
                    zh: '正在加载模板。这应该只需要片刻。',
                })}
            </motion.p>
        </motion.div>
    );
};
