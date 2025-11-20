import React, { useState, useEffect } from 'react';
import { Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { HiChevronUpDown, HiCheck } from 'react-icons/hi2';

export default function SearchHero(props) {
    const { website, block } = props;

    const { form } = block.getBlockContent();

    const { useNavigate, useLocation } = website.getRoutingComponents();

    const navigate = useNavigate();
    const location = useLocation();
    const [searchText, setSearchText] = useState('');
    const [searchTopic, setSearchTopic] = useState('');
    const [searchFaculty, setSearchFaculty] = useState('');
    const [searchLanguage, setSearchLanguage] = useState('');
    const [sort, setSort] = useState('');

    useEffect(() => {
        const params = new URLSearchParams(location.search);

        setSearchText(params.get('search') || '');
        setSearchTopic(params.get('topic') || '');
        setSearchFaculty(params.get('faculty') || '');
        setSearchLanguage(params.get('language') || '');
        setSort(params.get('sort') || '');
    }, [location.search]);

    const handleNavigateWithParam = (key, value) => {
        const params = new URLSearchParams(location.search);

        if (!value) {
            params.delete(key);
        } else {
            params.set(key, value);
        }

        const searchQuery = params.toString();
        navigate(`search${searchQuery ? `?${searchQuery}` : ''}`);
    };

    const handleResetFilters = () => {
        // reset all url parameters except for the search term
        const params = new URLSearchParams(location.search);
        params.delete('topic');
        params.delete('faculty');
        params.delete('language');
        params.delete('sort');

        const searchQuery = params.toString();
        navigate(`search${searchQuery ? `?${searchQuery}` : ''}`);
    };

    let resultKeyword = '';

    if (searchText && !searchTopic && !searchFaculty) {
        resultKeyword = searchText;
    } else if (searchTopic && !searchText && !searchFaculty) {
        resultKeyword = searchTopic;
    } else if (searchFaculty && !searchText && !searchTopic) {
        resultKeyword = searchFaculty;
    } else if (searchText || searchTopic || searchFaculty) {
        resultKeyword = 'mixed';
    }

    const languages =
        form
            .find((f) => f.category === 'language')
            ?.items?.map((i) => ({ label: i.label || i.value, value: i.value })) || null;
    const topics =
        form
            .find((f) => f.category === 'topic')
            ?.items?.map((i) => ({
                label: i.label || i.value,
                value: i.value,
            })) || null;
    const faculties =
        form
            .find((f) => f.category === 'faculty')
            ?.items?.map((i) => ({
                label: i.label || i.value,
                value: i.value,
            })) || null;

    if (languages) {
        languages.unshift({
            label: website.localize({
                en: 'All Languages',
                fr: 'Toutes les langues',
            }),
            value: 'all',
        });
    }

    if (topics) {
        topics.unshift({
            label: website.localize({
                en: 'All Topics',
                fr: 'Tous les sujets',
            }),
            value: 'all',
        });
    }

    if (faculties) {
        faculties.unshift({
            label: website.localize({
                en: 'All Faculties',
                fr: 'Toutes les facultés',
            }),
            value: 'all',
        });
    }

    const sorts = [
        { label: website.localize({ en: 'Relevance', fr: 'Pertinence' }), value: 'relevance' },
        { label: website.localize({ en: 'Name (A-Z)', fr: 'Nom (A-Z)' }), value: 'name-asc' },
        { label: website.localize({ en: 'Name (Z-A)', fr: 'Nom (Z-A)' }), value: 'name-desc' },
    ];

    const sortValue = sort || sorts[0].value;
    const languageValue = searchLanguage || languages[0].value;
    const topicValue = searchTopic || topics[0].value;
    const facultyValue = searchFaculty || faculties[0].value;

    const hasFilter = searchFaculty || searchLanguage || searchTopic || sort;

    const handleSearchValueChange = (category, value) => {
        handleNavigateWithParam(category, value);
    };

    return (
        <React.Fragment>
            <h1 className="text-3xl font-bold mb-4">
                {resultKeyword === 'mixed' &&
                    website.localize({
                        en: 'Results for Filtered Experts',
                        fr: 'Résultats pour les experts filtrés',
                    })}
                {resultKeyword &&
                    resultKeyword !== 'mixed' &&
                    website.localize({
                        en: `Results for "${resultKeyword}"`,
                        fr: `Résultats pour "${resultKeyword}"`,
                    })}
                {!resultKeyword &&
                    website.localize({
                        en: 'Search Experts',
                        fr: 'Rechercher des experts',
                    })}
            </h1>
            <div className="my-6 p-4 bg-text-color-0 border border-text-color/20 shadow rounded-[var(--border-radius)]">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                    {languages && (
                        <div className="md:col-span-1">
                            <FilterDropdown
                                label="Filter by language"
                                options={languages}
                                value={languageValue}
                                onChange={(value) => {
                                    handleSearchValueChange('language', value);
                                }}
                            />
                        </div>
                    )}

                    {faculties && (
                        <div className="md:col-span-1">
                            <FilterDropdown
                                label="Filter by faculty"
                                options={faculties}
                                value={facultyValue}
                                onChange={(value) => {
                                    handleSearchValueChange('faculty', value);
                                }}
                            />
                        </div>
                    )}

                    {topics && (
                        <div className="md:col-span-1">
                            <FilterDropdown
                                label="Filter by topic"
                                options={topics}
                                value={topicValue}
                                onChange={(value) => {
                                    handleSearchValueChange('topic', value);
                                }}
                            />
                        </div>
                    )}

                    <div className="md:col-span-1">
                        <FilterDropdown
                            label="Sort by"
                            options={sorts}
                            value={sortValue}
                            onChange={(value) => {
                                handleSearchValueChange('sort', value);
                            }}
                        />
                    </div>

                    <div className="md:col-span-1 flex items-end">
                        <button
                            type="button"
                            onClick={handleResetFilters}
                            disabled={!hasFilter}
                            className="w-full inline-flex items-center justify-center px-4 py-2 font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-btn-text-color rounded-[var(--border-radius)] transition-colors duration-200 disabled:opacity-50 disabled::hover:bg-btn-color disabled:cursor-not-allowed"
                        >
                            {website.localize({
                                en: 'Clear All',
                                fr: 'Tout effacer',
                            })}
                        </button>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

const FilterDropdown = ({ options, value, onChange }) => {
    const selected = options.find((option) => option.value === value);

    return (
        <Listbox value={value} onChange={onChange}>
            {/* <Label className="block text-sm font-medium text-heading-color mb-2">{label}</Label> */}
            <div className="relative">
                <ListboxButton className="grid w-full cursor-default grid-cols-1 rounded-md bg-text-color-0 py-2 pl-3 pr-2 text-left outline outline-1 -outline-offset-1 outline-text-color/20 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-primary-700 sm:text-sm">
                    <span className="col-start-1 row-start-1 truncate pr-6">{selected.label}</span>
                    <HiChevronUpDown
                        aria-hidden="true"
                        className="col-start-1 row-start-1 h-5 w-5 self-center justify-self-end text-text-color/60 sm:h-4 sm:w-4"
                    />
                </ListboxButton>

                <ListboxOptions
                    transition
                    className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-text-color-0 py-1 text-base shadow-lg outline outline-1 outline-text-color/10 data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in sm:text-sm"
                >
                    {options.map((option, i) => (
                        <ListboxOption
                            key={i}
                            value={option.value}
                            className="group relative cursor-default select-none py-2 pl-3 pr-9 data-[focus]:bg-primary-700 data-[focus]:text-text-color-0 data-[focus]:outline-none"
                        >
                            <span className="block truncate font-normal group-data-[selected]:font-semibold">
                                {option.label}
                            </span>

                            <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-primary-800 group-[:not([data-selected])]:hidden group-data-[focus]:text-text-color-0">
                                <HiCheck aria-hidden="true" className="w-5 h-5 text-inherit" />
                            </span>
                        </ListboxOption>
                    ))}
                </ListboxOptions>
            </div>
        </Listbox>
    );
};
