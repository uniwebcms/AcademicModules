import React, { useState, useEffect, useRef } from 'react';
import Container from '../_utils/Container';
import PopoverMenu from '../_utils/PopoverMenu';
import { website, twJoin, SafeHtml } from '@uniwebcms/module-sdk';
import { HiSearch, HiFilter, HiOutlineBookOpen, HiArrowRight, HiX, HiCheck } from 'react-icons/hi';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import { Switch, Dialog } from '@headlessui/react';
import { motion } from 'framer-motion';

const parseItems = (items) => {
    const parsed = items.map((item) => {
        const { title, subtitle, paragraphs, lists, properties } = item;

        return {
            title,
            description: subtitle,
            features: lists[0]?.map((item) => item.paragraphs?.[0]) || [],
            importance: paragraphs[0] || '',
            examples: properties[0]?.examples || [],
            properties: properties[0] || {},
            badge: properties[0]?.badge || null,
        };
    });

    return parsed;
};

const Sidebar = ({ items, settings, filters, setFilters }) => {
    if (!settings) return null;

    const { title, filterBy, resetItem } = settings;

    const sidebarItems = [{ label: resetItem, value: '' }];

    items.forEach((item) => {
        const key = item.properties[filterBy];

        if (key && !sidebarItems.some((item) => item.value === key)) {
            sidebarItems.push({
                label: key,
                value: key,
            });
        }
    });

    return (
        <div className="sticky top-8 hidden lg:block w-72 h-fit bg-neutral-800/50 rounded-lg py-4 px-4 border border-neutral-700">
            <h2 className="font-semibold text-lg mb-4 text-neutral-100">{title}</h2>
            <div className="space-y-1.5">
                {sidebarItems.map((item, index) => (
                    <button
                        key={index}
                        className={twJoin(
                            'w-full text-left px-4 py-2.5 rounded-lg transition-all duration-200 font-medium',
                            filters[filterBy] === item.value ? 'btn-secondary' : ''
                        )}
                        onClick={() => setFilters({ ...filters, [filterBy]: item.value })}
                    >
                        {item.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

const SidebarMobile = ({ items, settings, filters, setFilters }) => {
    const { filterBy, resetItem } = settings;

    const sidebarItems = [{ label: resetItem, value: '' }];

    items.forEach((item) => {
        const key = item.properties[filterBy];

        if (key && !sidebarItems.some((item) => item.value === key)) {
            sidebarItems.push({
                label: key,
                value: key,
            });
        }
    });

    const options = sidebarItems.map((item, index) => (
        <div
            key={index}
            className={twJoin(
                'w-full flex items-center space-x-2 px-3 py-1.5 transition-all duration-200 font-medium cursor-pointer',
                filters[filterBy] === item.value
                    ? 'bg-neutral-100 text-neutral-900'
                    : 'text-neutral-300 bg-neutral-800 hover:bg-neutral-700'
            )}
            onClick={() => setFilters({ ...filters, [filterBy]: item.value })}
        >
            {filters[filterBy] === item.value ? (
                <HiCheck className="w-4 h-4 text-inherit opacity-80" />
            ) : (
                <div className="w-4 h-4"></div>
            )}
            <span className="text-sm">{item.label}</span>
        </div>
    ));

    return (
        <PopoverMenu
            trigger={
                <div className="flex h-10 items-center justify-between rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 w-[180px] bg-neutral-800 border-neutral-700 text-neutral-100">
                    <span>{filters[filterBy] || resetItem}</span>
                    <MdOutlineKeyboardArrowDown className="w-4 h-4 text-inherit opacity-50" />
                </div>
            }
            options={options}
            menuClassName="w-[180px] bg-neutral-800 border border-neutral-600 rounded-md left-0 top-11 divide-y-0 overflow-hidden p-1"
        />
    );
};

const FilterMenu = ({ settings, filters, setFilters }) => {
    if (!settings) return null;

    const trigger = (
        <div className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 border h-10 px-4 py-2 gap-2 bg-neutral-800 border-neutral-700 text-neutral-300 hover:bg-neutral-700">
            <HiFilter className="w-4 h-4 text-inherit" />
            <span>
                {website.localize({
                    en: 'Filters',
                    fr: 'Filtres',
                    es: 'Filtros',
                    zh: '过滤器',
                })}
            </span>
        </div>
    );

    const options = settings.items.map((item, index) => {
        const { title, trueValue } = item;

        const enabled = filters[title].value === trueValue;

        const setEnabled = () => {
            if (enabled) {
                setFilters({
                    ...filters,
                    [title]: {
                        ...filters[title],
                        value: null,
                    },
                });
            } else {
                setFilters({
                    ...filters,
                    [title]: {
                        ...filters[title],
                        value: trueValue,
                    },
                });
            }
        };

        return (
            <Switch.Group key={index}>
                <div className="flex items-center justify-between">
                    <Switch.Label className="font-medium text-sm text-neutral-300 mr-2">
                        {title}
                    </Switch.Label>
                    <Switch
                        checked={enabled}
                        onChange={setEnabled}
                        className={`${
                            enabled ? 'bg-neutral-700' : 'bg-neutral-900'
                        } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:ring-offset-2`}
                    >
                        <span
                            className={`${
                                enabled ? 'translate-x-6' : 'translate-x-1'
                            } inline-block h-4 w-4 transform rounded-full bg-neutral-50 transition-transform`}
                        />
                    </Switch>
                </div>
            </Switch.Group>
        );
    });

    return (
        <PopoverMenu
            trigger={trigger}
            options={options}
            autoClose={false}
            menuClassName="w-56 p-3 bg-neutral-800 border border-neutral-600 rounded-md divide-y-0 space-y-3 -left-28 top-10 mt-1"
        />
    );
};

const ItemCard = ({ item, theme, style }) => {
    const { title, description, features, importance, examples, badge } = item;

    const [dialogOpen, setDialogOpen] = useState(false);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full h-full rounded-lg border shadow-sm antialiased bg-neutral-800/90 backdrop-blur-sm border-neutral-700 hover:bg-neutral-800/70 transition-all duration-300"
        >
            <div className="p-5 flex flex-col h-full">
                {/* header */}
                <div className="flex items-center justify-between gap-2 mb-3">
                    <h3 className="text-xl font-semibold text-neutral-100">{title}</h3>
                    {/* badge */}
                    {badge && (
                        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 border-transparent bg-gradient-to-r from-secondary-900 to-secondary-800 text-secondary-100 border-none">
                            {badge.text}
                        </div>
                    )}
                </div>
                {/* description */}
                <p className="text-neutral-400 mb-4 leading-relaxed">{description}</p>
                {/* features */}
                <ul className="space-y-1.5 mb-4">
                    {features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-secondary-500 shrink-0"></span>
                            <span className="text-neutral-300 text-sm">{feature}</span>
                        </li>
                    ))}
                </ul>
                {/* importance and examples */}
                <div className="mt-auto space-y-4">
                    {importance ? (
                        <div className="p-3 rounded-lg bg-gradient-to-r from-secondary-900/30 to-secondary-800/30 border border-secondary-800/50">
                            <SafeHtml
                                value={importance}
                                className="text-secondary-200 text-sm"
                            ></SafeHtml>
                        </div>
                    ) : null}
                    {examples.length > 0 ? (
                        <div
                            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors h-10 px-4 py-2 ml-auto group text-neutral-300 hover:text-secondary-300 hover:bg-secondary-900/20"
                            onClick={() => setDialogOpen(true)}
                        >
                            <HiOutlineBookOpen className="w-4 h-4 mr-2" />
                            <span>
                                {website.localize({
                                    en: 'See Examples',
                                    fr: 'Voir les exemples',
                                    es: 'Ver ejemplos',
                                    zh: '查看示例',
                                })}
                            </span>
                            <HiArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                        </div>
                    ) : null}
                </div>
            </div>

            {/* dialog */}
            <Dialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                className={twJoin('relative z-50 focus:outline-none', theme)}
                style={style}
            >
                <div className="fixed inset-0 z-50 bg-black/80"></div>
                <Dialog.Panel className="fixed left-[50%] top-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%] gap-4 border p-6 shadow-lg sm:rounded-lg max-w-3xl rounded-xl bg-neutral-900 text-neutral-100 border-neutral-700 transform transition-transform duration-300 ease-in-out">
                    <div
                        className="absolute top-4 right-4 cursor-pointer"
                        onClick={() => setDialogOpen(false)}
                    >
                        <HiX className="w-5 h-5 text-neutral-300 hover:text-neutral-100" />
                    </div>
                    {/* title */}
                    <div className="flex flex-col space-y-1.5 text-center sm:text-left">
                        <h2 className="font-semibold tracking-tight text-2xl text-neutral-100">
                            <span>{title}</span>{' '}
                            <span>
                                {website.localize({
                                    en: 'Examples',
                                    fr: 'Exemples',
                                    es: 'Ejemplos',
                                    zh: '示例',
                                })}
                            </span>
                        </h2>
                        <p className="text-sm text-neutral-400">
                            {website.localize({
                                en: 'See how organizations are using this feature',
                                fr: 'Découvrez comment les organisations utilisent cette fonctionnalité',
                                es: 'Vea cómo las organizaciones están utilizando esta función',
                                zh: '看看组织如何使用此功能',
                            })}
                        </p>
                    </div>
                    {/* examples */}
                    <div className="space-y-6 mt-4">
                        {examples.map((example, index) => (
                            <div
                                key={index}
                                className="p-5 rounded-xl bg-gradient-to-r from-neutral-800 to-neutral-800/50 border border-neutral-700"
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="h-8 w-8 rounded-full bg-secondary-900/50 flex items-center justify-center text-secondary-300 font-medium">
                                        {index + 1}
                                    </div>
                                    <h3 className="text-lg font-semibold text-neutral-100">
                                        {example.scenario}
                                    </h3>
                                </div>
                                <p className="text-neutral-300 ml-11 leading-relaxed">
                                    {example.explanation}
                                </p>
                            </div>
                        ))}
                    </div>
                </Dialog.Panel>
            </Dialog>
        </motion.div>
    );
};

const initialFilters = (properties) => {
    const state = {};

    if (properties.sidebar?.filterBy) {
        state[properties.sidebar.filterBy] = properties.sidebar.default || '';
    }

    if (properties.search) {
        state.search = '';
    }

    if (properties.filters?.items) {
        properties.filters.items.forEach((item) => {
            state[item.title] = {
                target: item.target,
                trueValue: item.trueValue,
                value: item.default,
            };
        });
    }

    return state;
};

const filterItems = (items, filters) => {
    const { category: selectedCategory, search: searchQuery, ...other } = filters;

    return items.filter((item) => {
        const { properties } = item;

        if (selectedCategory !== '' && properties.category !== selectedCategory) return false;

        let pass = false;

        if (
            Object.values(other).some(
                (filter) =>
                    filter.trueValue === filter.value && properties[filter.target] === filter.value
            )
        ) {
            pass = true;
        }

        if (!pass) return false;

        const searchLower = searchQuery.toLowerCase();
        return (
            searchQuery === '' ||
            item.title.toLowerCase().includes(searchLower) ||
            item.description.toLowerCase().includes(searchLower) ||
            item.details?.some((detail) => detail.toLowerCase().includes(searchLower)) ||
            item.importance?.toLowerCase().includes(searchLower)
        );
    });
};

export default function ContentManager(props) {
    const { block } = props;

    const { title, subtitle, properties } = block.getBlockContent();

    const settings = properties[0] || {};

    const items = parseItems(block.getBlockItems());

    const [filters, setFilters] = useState(initialFilters(settings));
    const [sectionStyle, setSectionStyle] = useState({});
    const [dialogOpen, setDialogOpen] = useState(false);

    const filteredItems = filterItems(items, filters);

    // this is for the Dialog to use all css variables from the section
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

    return (
        <Container px="sm" py="md" className="max-w-7xl mx-auto">
            {/* heading */}
            <div className="text-center mb-12 max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-light mb-4">{title}</h1>
                {subtitle && (
                    <p className="text-lg max-w-2xl mx-auto mb-8 leading-relaxed">{subtitle}</p>
                )}
            </div>
            {/* content */}
            <div className="flex gap-8">
                {/* sidebar */}
                <Sidebar
                    items={items}
                    settings={settings?.['sidebar']}
                    {...{ filters, setFilters }}
                />
                {/* content */}
                <div className="flex-1 space-y-6">
                    {/* filter bar */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8">
                        {/* mobile screen sidebar filter menu */}
                        {settings?.['sidebar'] && (
                            <div className="lg:hidden">
                                <SidebarMobile
                                    items={items}
                                    settings={settings.sidebar}
                                    {...{ filters, setFilters }}
                                />
                            </div>
                        )}
                        {/* search bar */}
                        {settings?.['search'] && (
                            <div className="relative flex-1">
                                <HiSearch className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 pointer-events-none z-10" />
                                <input
                                    type="text"
                                    placeholder={settings.search.placeholder}
                                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-neutral-800/50 border-neutral-700 border focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 text-neutral-100 placeholder-neutral-400 backdrop-blur-sm transition-all duration-200 ease-in-out"
                                    value={filters.search}
                                    onChange={(e) =>
                                        setFilters({ ...filters, search: e.target.value })
                                    }
                                ></input>
                            </div>
                        )}
                        {/* filtered results and filter menu */}
                        <div className="flex items-center gap-3">
                            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-secondary-900/30 text-secondary-300 border-secondary-800/50">
                                {filteredItems.length}{' '}
                                {website.localize({
                                    en: 'Results',
                                    fr: 'Résultats',
                                    es: 'Resultados',
                                    zh: '结果',
                                })}
                            </div>
                            <FilterMenu settings={settings.filters} {...{ filters, setFilters }} />
                        </div>
                    </div>
                    {/* content cards */}
                    <div className="relative min-h-[calc(100vh-16rem)]">
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                            {filteredItems.map((item, index) => (
                                <ItemCard
                                    key={index}
                                    {...{ item }}
                                    theme={block.themeName}
                                    style={sectionStyle}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
}
