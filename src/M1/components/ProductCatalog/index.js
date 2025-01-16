import React, { useState, useEffect, useRef } from 'react';
import Container from '../_utils/Container';
import PopoverMenu from '../_utils/PopoverMenu';
import { Link, twJoin, website, Image } from '@uniwebcms/module-sdk';
import { HiSearch, HiArrowRight } from 'react-icons/hi';
import { TbSortDescending } from 'react-icons/tb';
import { LuChevronDown } from 'react-icons/lu';

const InfoModal = ({ text, trigger_text }) => {
    return <p className="text-sm text-neutral-600">{text}</p>;
};

const FilterBar = ({ name, options, filters, setFilters, filled = true }) => {
    const activeClassFilled = 'border-neutral-900 bg-neutral-900 text-neutral-50';
    const activeClass = 'border-neutral-300 bg-neutral-50 text-neutral-900';

    const inactiveClassFilled = 'border-transparent text-neutral-800 hover:bg-neutral-200';
    const inactiveClass = 'border-neutral-200 text-neutral-800 hover:bg-neutral-100';

    return (
        <div className="">
            <div
                className={twJoin(
                    'flex justify-center border rounded-full p-1 gap-2',
                    filled ? 'border-neutral-300' : 'border-transparent bg-neutral-200'
                )}
            >
                {options.map((option, index) => {
                    const active = filters[name] === option.value;

                    return (
                        <div
                            key={index}
                            onClick={() => setFilters({ ...filters, [name]: option.value })}
                            className={twJoin(
                                'text-sm font-medium px-4 py-1.5 rounded-full border cursor-pointer',
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

const SortMenu = ({ data, filters, setFilters }) => {
    const [open, setOpen] = useState(false);
    const dropdownRef = React.useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const options = Object.entries(data).map(([name, label], index) => {
        const checked = filters['sort'] === name;

        return (
            <label className="flex items-center gap-3 text-sm px-2" key={index}>
                <input
                    type="radio"
                    name={name}
                    value={name}
                    checked={checked}
                    onChange={() => setFilters({ ...filters, sort: name })}
                />
                <span>{label}</span>
            </label>
        );
    });

    return (
        <div className="relative w-56 flex justify-end">
            <div
                className="flex items-center whitespace-nowrap rounded-full text-sm font-medium px-4 py-2.5 border border-neutral-300 cursor-pointer max-w-full w-fit group"
                onClick={() => setOpen(!open)}
            >
                <TbSortDescending
                    className={twJoin(
                        'w-4 h-4 text-inherit mr-2',
                        open ? 'opacity-90' : 'opacity-70 group-hover:opacity-100'
                    )}
                />
                <span className={open ? 'opacity-80 ' : 'opacity-60 group-hover:opacity-100'}>
                    {website.localize({
                        en: 'Sort:',
                        fr: 'Trier:',
                        es: 'Ordenar:',
                        zh: '排序：',
                    })}
                </span>
                {filters['sort'] && <span className="ml-2 truncate">{data[filters['sort']]}</span>}
                <LuChevronDown
                    className={twJoin(
                        'w-4 h-4 text-inherit ml-2',
                        open ? 'rotate-180 opacity-90' : 'opacity-70 group-hover:opacity-100'
                    )}
                />
            </div>
            <div className="absolute top-12 right-0 z-10">
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

const Products = ({ profiles }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {profiles.map((profile, index) => {
                const { title, subtitle } = profile.getBasicInfo();

                return (
                    <div className="flex flex-col w-full group" key={index}>
                        <div className="p-2 bg-transparent group-hover:bg-neutral-200 rounded-lg">
                            <Image
                                profile={profile}
                                type="banner"
                                className="w-full h-48 object-cover rounded-lg border"
                            />
                        </div>
                        <div className="pt-2 px-2">
                            <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
                            <p className="mt-1 text-sm text-neutral-700 line-clamp-3">{subtitle}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default function ProductCatalog(props) {
    const { block, input } = props;

    const { title, links, properties } = block.getBlockContent();

    const items = block.getBlockItems();

    const [searchText, setSearchText] = useState('');
    const [filters, setFilters] = useState({});

    const { search_box, info_modal, filters: filterInfo = [], sort } = properties;

    return (
        <Container className="max-w-9xl mx-auto">
            {/* header, search, info_modal and link in a bar */}
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-4xl font-semibold">{title}</h2>
                {search_box && (
                    <div className="relative border border-neutral-300 rounded-full px-6 py-3 w-full max-w-80">
                        <HiSearch className="absolute top-1/2 left-5 transform -translate-y-1/2 text-neutral-400 w-6 h-6" />
                        <input
                            type="text"
                            placeholder={search_box.placeholder}
                            className="pl-8 w-full focus:outline-none placeholder:text-neutral-500"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        ></input>
                    </div>
                )}
                {info_modal && <InfoModal {...info_modal} />}
                {links[0] && (
                    <Link
                        to={links[0].href}
                        className="flex items-center space-x-1 text-lg font-medium group text-neutral-600/95 hover:text-neutral-700"
                    >
                        <span>{links[0].label}</span>
                        <HiArrowRight className="w-5 h-5 text-inherit group-hover:translate-x-1 transition-transform" />
                    </Link>
                )}
            </div>
            {/* filters and sorts */}
            <div className="flex justify-between items-center mb-10">
                {filterInfo.map((filter, index) => (
                    <FilterBar
                        key={index}
                        {...filter}
                        filled={index % 2 === 0}
                        filters={filters}
                        setFilters={setFilters}
                    />
                ))}
                {sort && <SortMenu data={sort} filters={filters} setFilters={setFilters} />}
            </div>
            {/* products */}
            <Products profiles={input.profiles || []} />
        </Container>
    );
}
