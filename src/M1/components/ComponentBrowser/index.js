import React, { useState, useEffect, useRef } from 'react';
import Container from '../_utils/Container';
import { twJoin, website } from '@uniwebcms/module-sdk';
import { HiArrowRight } from 'react-icons/hi';
import { TbSortDescending } from 'react-icons/tb';
import { LuChevronDown, LuLayers2, LuCrown, LuGem } from 'react-icons/lu';
import { IoPricetagsOutline } from 'react-icons/io5';
import VirtualGrid from './components/VirtualGrid';
import { fetchWebstylers } from './helper';
import Modal from './components/Modal';
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
                    'flex border rounded-full p-1 gap-1 xl:gap-2 w-full overflow-x-auto no-scrollbar hover:shadow-sm border-neutral-300'
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

    const { sort, ...actualFilters } = filters;

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

    const filterObj = {};

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

export default function ComponentBrowser(props) {
    const { block, input } = props;
    const { title, subtitle, properties } = block.getBlockContent();
    const { filters: filterInfo = [], sort } = properties;
    const inlineFilter = filterInfo.find((filter) => filter.type === 'inline');
    const menuFilter = filterInfo.find((filter) => filter.type === 'menu');

    const { useLocation } = website.getRoutingComponents();
    const location = useLocation();

    const updateFilters = (key, newValue) => {
        setFilters((prevFilters) => ({ ...prevFilters, [key]: newValue }));
    };

    const updateSort = (newSort) => {
        setFilters((prevFilters) => ({ ...prevFilters, sort: newSort }));
    };

    const [webstylers, setWebstylers] = useState([]);
    const [filters, setFilters] = useState(initFilters(properties));
    const [sectionStyle, setSectionStyle] = useState({});

    useEffect(() => {
        fetchWebstylers().then((webstylers) => {
            setWebstylers(webstylers);
        });
    }, []);

    // get the category and type from the URL if they exist, set them to the filters
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const category = searchParams.get('category');
        const type = searchParams.get('type');

        if (category || type) {
            setFilters((prevFilters) => {
                const updatedFilters = { ...prevFilters };

                if (category && prevFilters.category !== category) {
                    updatedFilters.category = category;
                }

                if (type && prevFilters.type !== type) {
                    updatedFilters.type = type;
                }

                return updatedFilters;
            });

            // Clean up the URL to remove 'category' and 'type' params (without causing a page reload)
            searchParams.delete('category');
            searchParams.delete('type');

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

    const mainTitle = (
        <h2 className="text-xl lg:text-2xl xl:text-3xl font-semibold text-nowrap lg:mr-8 w-44 lg:w-fit">
            {title}
        </h2>
    );

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

    const developOwn = (
        <div
            className="flex items-center space-x-1 text-base lg:text-lg font-medium group text-neutral-600/95 hover:text-neutral-700 cursor-pointer ml-6 lg:ml-auto w-44 lg:w-fit justify-end lg:justify-normal"
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
            <span className="text-nowrap">
                {website.localize({
                    en: 'Develop your own',
                    fr: 'Développez le vôtre',
                    es: 'Desarrolla el tuyo',
                    zh: '开发自己的模板',
                })}
            </span>
            <HiArrowRight className="w-5 h-5 text-inherit group-hover:translate-x-1 transition-transform flex-shrink-0" />
        </div>
    );

    return (
        <Container className="max-w-9xl mx-auto">
            {/* title and link in a bar */}
            <div className="flex justify-between items-start mb-2">
                {mainTitle}
                {developOwn}
            </div>

            {/* subtitle */}
            <p className="text-sm md:text-base text-neutral-600 max-w-full md:max-w-xl xl:max-w-2xl mb-8">
                {subtitle}
            </p>

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
                        {filterMenu}
                        {sortMenu}
                    </div>
                </div>
            </>
            {/* grid */}
            <VirtualGrid data={webstylers} filters={filters} />
        </Container>
    );
}

ComponentBrowser.Loader = () => {
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
                    en: 'Fetching standard foundations for your next website-hang tight!',
                    fr: 'Récupération des fondations standard pour votre prochain site web - Patientez !',
                    es: 'Obteniendo los fundamentos estándar para tu próximo sitio web - ¡Espera un momento!',
                    zh: '正在获取您下一个网站的标准基础 - 请稍候！',
                })}
            </motion.p>
        </motion.div>
    );
};
