import React, { act } from 'react';
import Searcher from '../_utils/Searcher';
import Select from './FilterSelect';
import { HiX } from 'react-icons/hi';

export default function (props) {
    const { mode = 'sticky', sticky = true, filter, setFilter, categories, category, setCategory, website } = props;

    const sidebarStyle = props.sidebarStyle ? `${props.sidebarStyle}` : `flex flex-col`;

    const initStyle = sticky
        ? 'md:sticky md:top-4 h-full'
        : mode === 'static'
        ? 'h-full md:sticky md:top-3 md:self-start md:h-auto'
        : 'h-full';

    return (
        <div className={`hidden md:flex flex-shrink-0 w-60 md:w-64 justify-end ${initStyle}`}>
            <div
                className={`pt-5 pb-6  h-auto ${mode === 'static' ? 'static' : ''}`}
                style={{
                    width: 'inherit',
                    paddingLeft: '1px',
                    paddingRight: '1px'
                }}
            >
                <div className={`${sidebarStyle} scrollbar`} style={{ maxHeight: '100%' }}>
                    <div className={`w-full mb-3 flex`}>
                        <Searcher
                            {...{
                                width: 'w-full',
                                filter,
                                setFilter: (selection) => {
                                    setFilter({
                                        ...filter,
                                        selection
                                    });
                                }
                            }}
                        />
                    </div>
                    <h2 className={`font-bold uppercase mt-4`}>
                        {website.localize({
                            en: 'Filter By',
                            fr: 'Filtrer par'
                        })}
                    </h2>
                    <div className={`w-full mb-3 flex flex-col mt-3 gap-6`}>
                        {categories.map((categoryItem) => {
                            const { label, name, values } = categoryItem;

                            let selectedVal = category?.[name] || [];

                            return (
                                <div className="flex flex-col gap-2" key={name}>
                                    <Select
                                        label={label}
                                        options={values}
                                        selected={selectedVal}
                                        setSelected={(val) => {
                                            setCategory(name, val);
                                        }}
                                    />
                                    {selectedVal.map((val) => {
                                        let label = val;
                                        if (name === 'topic') {
                                            let active = values.find((item) => item.value === val);
                                            label = active.label;
                                        }

                                        return (
                                            <div
                                                key={val}
                                                className={`flex items-center justify-between px-3 py-1 bg-bg-color-80 rounded text-sm truncate`}
                                            >
                                                <span className="line-clamp-1">{label}</span>
                                                <HiX
                                                    className={`text-text-color-90 cursor-pointer`}
                                                    onClick={() => {
                                                        setCategory(
                                                            name,
                                                            selectedVal.filter((item) => item !== val)
                                                        );
                                                    }}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
