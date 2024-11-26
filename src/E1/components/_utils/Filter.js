import React, { Fragment } from 'react';
import { HiChevronDown } from 'react-icons/hi';
import { Popover, Transition } from '@headlessui/react';

const ExpertFilter = (props) => {
    const { website, experts, filter, setFilter } = props;

    const units = {};
    const positions = {};

    experts.forEach((expert) => {
        const head = expert.getBasicInfo().head;
        const unit = head.academic_unit;
        const position = head.position_title;

        if (unit) {
            units[unit[0]] = {
                label: unit[1],
                value: unit[0]
            };
        }

        if (position) {
            positions[position[0]] = {
                label: position[1],
                value: position[0]
            };
        }
    });

    const filters = [
        {
            id: 'unit',
            name: website.localize({
                en: 'Academic unit',
                fr: 'Unité académique'
            }),
            options: Object.values(units).sort((a, b) => a.label.localeCompare(b.label))
        },
        {
            id: 'position',
            name: website.localize({
                en: 'Position title',
                fr: 'Titre du poste'
            }),
            options: Object.values(positions).sort((a, b) => a.label.localeCompare(b.label))
        }
    ];

    return (
        <div className='flow-root ml-auto mr-4'>
            <Popover.Group className='-mx-4 flex items-center divide-x divide-gray-200'>
                {filters.map((section) => (
                    <Popover key={section.name} className='relative inline-block px-4 text-left'>
                        <Popover.Button className='group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900'>
                            <span>{section.name}</span>
                            {Object.keys(filter?.[section.id] || {}).length ? (
                                <span className='ml-1.5 rounded bg-gray-200 px-1.5 py-0.5 text-xs font-semibold tabular-nums text-gray-700'>
                                    {Object.keys(filter?.[section.id] || {}).length}
                                </span>
                            ) : null}
                            <HiChevronDown
                                className='-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500'
                                aria-hidden='true'
                            />
                        </Popover.Button>

                        <Transition
                            as={Fragment}
                            enter='transition ease-out duration-100'
                            enterFrom='transform opacity-0 scale-95'
                            enterTo='transform opacity-100 scale-100'
                            leave='transition ease-in duration-75'
                            leaveFrom='transform opacity-100 scale-100'
                            leaveTo='transform opacity-0 scale-95'>
                            <Popover.Panel className='absolute right-0 z-10 mt-2 origin-top-right rounded-md bg-white p-4 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none'>
                                <form className='space-y-4'>
                                    {section.options.map((option, optionIdx) => (
                                        <div key={option.value} className='flex items-center'>
                                            <input
                                                id={`filter-${section.id}-${optionIdx}`}
                                                name={`${section.id}[]`}
                                                defaultValue={option.value}
                                                type='checkbox'
                                                defaultChecked={filter?.[section.id]?.[option.value]}
                                                onChange={(e) => {
                                                    const curFilter = filter?.[section.id] || {};

                                                    if (e.target.checked) {
                                                        curFilter[option.value] = true;
                                                    } else {
                                                        delete curFilter[option.value];
                                                    }

                                                    setFilter({
                                                        ...filter,
                                                        [section.id]: curFilter
                                                    });
                                                }}
                                                className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500'
                                            />
                                            <label
                                                htmlFor={`filter-${section.id}-${optionIdx}`}
                                                className='ml-3 whitespace-nowrap pr-6 text-sm font-medium text-gray-900'>
                                                {option.label}
                                            </label>
                                        </div>
                                    ))}
                                </form>
                            </Popover.Panel>
                        </Transition>
                    </Popover>
                ))}
            </Popover.Group>
        </div>
    );
};

export default ExpertFilter;
