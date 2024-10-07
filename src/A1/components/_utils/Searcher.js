import React, { useState, useRef } from 'react';
import { BsSearch, BsX } from 'react-icons/bs';
import { twMerge, website } from '@uniwebcms/module-sdk';

export default function Searcher(props) {
    const {
        filter: { selection },
        setFilter,
        width = 'w-48',
    } = props;

    const { _search: searchText = '' } = selection;

    const handleSearch = (val) => {
        setFilter({
            ...selection,
            _search: val || '',
        });
    };

    const [search, setSearch] = useState(searchText);

    const inputRef = useRef();

    return (
        <div
            className={twMerge(
                `relative ${width} px-2 2xl:px-2.5 py-1.5 flex items-center space-x-2 2xl:space-x-2 border border-text-color-20 bg-text-color-10 rounded-lg overflow-hidden hover:bg-text-color-0 focus-within:bg-text-color-0 shadow`
            )}
            onClick={() => inputRef.current.focus()}
        >
            <BsSearch
                className="flex-shrink-0 w-[18px] h-[18px] text-text-color-60"
                aria-hidden="true"
            />
            <input
                ref={inputRef}
                type="text"
                name="search"
                id="search"
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value);
                    handleSearch(e.target.value);
                }}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        handleSearch(input);
                    }
                }}
                placeholder={website.localize({
                    en: 'Search',
                    fr: 'Rechercher',
                })}
                className="block w-[128px] border-0 bg-inherit placeholder:text-text-color-80 text-text-color-90 text-base 2xl:text-lg focus:outline-none"
            />
            <div
                className={twMerge(
                    'absolute inset-y-0 right-0.5 cursor-pointer',
                    search ? 'flex items-center' : 'hidden'
                )}
            >
                <BsX
                    className="w-6 h-6 text-text-color-70 hover:text-text-color-90"
                    onClick={() => {
                        setSearch('');
                        handleSearch('');
                    }}
                />
            </div>
        </div>
    );
}
